import tkinter as tk
from tkinter import filedialog, messagebox
import xml.etree.ElementTree as ET
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import re

def scrape_data():
    # Get the URL(s) from the input field
    urls = url_input.get("1.0", "end-1c").splitlines()
    
    # Set up the Selenium WebDriver (Chrome) with custom User-Agent
    options = webdriver.ChromeOptions()
    options.add_argument("--headless")  # Run in headless mode (no UI)
    options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36")
    driver = webdriver.Chrome(options=options)

    # Create an XML structure to hold the scraped data
    root = ET.Element("Data")

    # Clear the results text box before appending new data
    result_text.delete(1.0, tk.END)

    for url in urls:
        driver.get(url)

        # Wait for the modal gallery or any image elements to load (wait for specific class name)
        try:
            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "_image__p95wJ"))
            )
        except:
            result_text.insert(tk.END, f"Timed out waiting for images to load for URL: {url}\n")
            continue

        # Get the page source after rendering JavaScript
        page_source = driver.page_source

        # Use BeautifulSoup to parse the page
        soup = BeautifulSoup(page_source, 'html.parser')

        # Extract data from the page
        title = soup.find('h1').text if soup.find('h1') else "No title found"
        description = soup.find('p', class_='_content__om2Q_').text if soup.find('p', class_='_content__om2Q_') else "No description found"
        price = soup.find('h2', class_='_price__EH7rC').text if soup.find('h2', class_='_price__EH7rC') else "No price found"

        # Extract ad license number
        ad_license_element = soup.find('p', text="رخصة الإعلان")
        if ad_license_element:
            ad_license = ad_license_element.find_next('p', class_='_label___qjLO _brandText__qqCB1').text
        else:
            ad_license = "No ad license found"

        # Extract all image URLs
        image_elements = soup.find_all('img', class_='_image__p95wJ')
        image_urls = [img['src'] for img in image_elements if 'src' in img.attrs]

        if not image_urls:
            all_images = soup.find_all('img')
            image_urls = [img['src'] for img in all_images if 'src' in img.attrs]

        # Filter image URLs using a regex pattern
        pattern = r'https://images\.aqar\.fm/webp/\d+x\d+/props/\d+_\d+\.jpg'
        filtered_image_urls = [img_url for img_url in image_urls if re.match(pattern, img_url)]

        # Append scraped data to result_text in the GUI
        result_text.insert(tk.END, f"Scraping URL: {url}\n")
        result_text.insert(tk.END, f"Title: {title}\n")
        result_text.insert(tk.END, f"Description: {description}\n")
        result_text.insert(tk.END, f"Price: {price}\n")
        result_text.insert(tk.END, f"Ad License: {ad_license}\n")
        
        if filtered_image_urls:
            result_text.insert(tk.END, "Filtered Image URLs:\n")
            for img_url in filtered_image_urls:
                result_text.insert(tk.END, f"  {img_url}\n")
        else:
            result_text.insert(tk.END, "No images matching the desired pattern found.\n")

        # Create XML elements for the scraped data
        item = ET.SubElement(root, "Item")
        ET.SubElement(item, "Title").text = title
        ET.SubElement(item, "Description").text = description
        ET.SubElement(item, "Price").text = price
        ET.SubElement(item, "AdLicense").text = ad_license

        images_elem = ET.SubElement(item, "Images")
        for img_url in filtered_image_urls:
            ET.SubElement(images_elem, "ImageURL").text = img_url

    # Enable the save button after scraping is done
    save_button.config(state=tk.NORMAL)

    driver.quit()

def save_file():
    file_path = filedialog.asksaveasfilename(defaultextension=".xml", filetypes=[("XML Files", "*.xml")])
    if file_path:
        # Create XML tree and write to file
        tree = ET.ElementTree(root)
        tree.write(file_path)
        messagebox.showinfo("Success", f"Data saved as XML to: {file_path}")

# Set up the GUI
root = tk.Tk()
root.title("Web Scraper")

# URL input field
url_label = tk.Label(root, text="Enter URL(s) (one per line):")
url_label.pack()

url_input = tk.Text(root, height=10, width=50)
url_input.pack()

# Scrape Button
scrape_button = tk.Button(root, text="Scrape Data", command=scrape_data)
scrape_button.pack()

# Results text box (to display scraped data)
result_text = tk.Text(root, height=15, width=50)
result_text.pack()

# Save Button (disabled until scraping is complete)
save_button = tk.Button(root, text="Save as XML", command=save_file, state=tk.DISABLED)
save_button.pack()

# Run the GUI
root.mainloop()
