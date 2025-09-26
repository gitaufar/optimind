"""
Test OCR save functionality directly
"""
import asyncio
import os
from services.ocr_services import OCRService

class FakeUploadFile:
    def __init__(self, content_bytes, filename):
        self.content = content_bytes
        self.filename = filename
        self._position = 0
    
    async def read(self):
        return self.content
    
    async def seek(self, position):
        self._position = position

async def test_ocr_direct():
    print("🔍 Testing OCR save functionality directly...")
    
    # Check if there's a sample file
    sample_files = []
    
    # Look for PDF files in data/uploads
    if os.path.exists("data/uploads"):
        for file in os.listdir("data/uploads"):
            if file.lower().endswith('.pdf'):
                sample_files.append(os.path.join("data/uploads", file))
    
    if not sample_files:
        print("❌ No PDF files found in data/uploads")
        return
    
    sample_file = sample_files[0]
    print(f"📄 Using sample file: {sample_file}")
    
    # Read file content
    with open(sample_file, 'rb') as f:
        content = f.read()
    
    # Create fake upload file
    fake_file = FakeUploadFile(content, os.path.basename(sample_file))
    
    # Test OCR service
    ocr_service = OCRService()
    
    if not ocr_service.ocr_available:
        print("❌ OCR service not available")
        return
    
    print("✅ OCR service available")
    
    try:
        print("🔄 Extracting text and saving to file...")
        extracted_text, filepath = await ocr_service.extract_and_save_from_pdf(fake_file)
        
        print(f"📝 Extracted text length: {len(extracted_text)} characters")
        print(f"📄 Text preview: {extracted_text[:300]}...")
        
        if filepath and os.path.exists(filepath):
            print(f"✅ OCR result saved to: {filepath}")
            
            # Check file size
            file_size = os.path.getsize(filepath)
            print(f"📊 File size: {file_size} bytes")
            
            # List all files in outputs directory
            if os.path.exists("data/outputs"):
                print(f"\n📂 Files in data/outputs:")
                for file in os.listdir("data/outputs"):
                    if file.endswith('.txt'):
                        file_path = os.path.join("data/outputs", file)
                        size = os.path.getsize(file_path)
                        print(f"   📄 {file} ({size} bytes)")
        else:
            print("❌ OCR result file not created")
            
    except Exception as e:
        print(f"❌ OCR test failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_ocr_direct())