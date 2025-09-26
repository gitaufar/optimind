#!/usr/bin/env python3
"""
Test script untuk menguji perbaikan Groq analysis
Membandingkan sebelum dan sesudah optimasi smart chunking
"""

import asyncio
import json
import time
from services.groq_services import GroqService
from services.ocr_services import OCRService

async def test_groq_analysis():
    """Test improved Groq analysis with better smart chunking"""
    
    # Initialize services
    groq_service = GroqService()
    ocr_service = OCRService()
    
    # Test file - PDF contract that was problematic
    test_pdf = r"d:\ifest\sample_contract\REVIS KONTRAK 22 FEB.pdf"
    
    print("=== TESTING IMPROVED GROQ ANALYSIS ===")
    print(f"Testing with: {test_pdf}")
    
    try:
        # Extract text using OCR
        print("\n1. Extracting text with OCR...")
        start_time = time.time()
        extracted_text, ocr_file_path = await ocr_service.extract_and_save(test_pdf)
        ocr_time = time.time() - start_time
        
        print(f"✓ OCR completed in {ocr_time:.2f} seconds")
        print(f"✓ Text extracted: {len(extracted_text)} characters")
        print(f"✓ Saved to: {ocr_file_path}")
        
        # Show preview of extracted text
        preview = extracted_text[:500] + "..." if len(extracted_text) > 500 else extracted_text
        print(f"\nText preview:\n{preview}\n")
        
        # Analyze with improved Groq
        print("2. Analyzing with improved Groq service...")
        start_time = time.time()
        analysis_result = await groq_service.analyze_contract_details(extracted_text)
        analysis_time = time.time() - start_time
        
        print(f"✓ Analysis completed in {analysis_time:.2f} seconds")
        
        # Display results
        print("\n=== ANALYSIS RESULTS ===")
        print(json.dumps(analysis_result, indent=2, ensure_ascii=False))
        
        # Check for specific improvements
        print("\n=== QUALITY CHECK ===")
        if isinstance(analysis_result, dict):
            # Check for specific named parties (not generic)
            first_party = analysis_result.get("first_party", {})
            second_party = analysis_result.get("second_party", {})
            
            first_party_name = first_party.get("name", "").lower() if isinstance(first_party, dict) else ""
            second_party_name = second_party.get("name", "").lower() if isinstance(second_party, dict) else ""
            
            # Quality indicators
            has_specific_names = not ("pihak pertama" in first_party_name or "pihak kedua" in second_party_name)
            has_contract_value = "contract_value" in analysis_result and analysis_result["contract_value"] not in [None, "", "tidak disebutkan"]
            has_end_date = "contract_end_date" in analysis_result and analysis_result["contract_end_date"] not in [None, "", "tidak disebutkan"]
            
            print(f"✓ Specific party names (not generic): {'YES' if has_specific_names else 'NO'}")
            print(f"✓ Contract value extracted: {'YES' if has_contract_value else 'NO'}")
            print(f"✓ End date extracted: {'YES' if has_end_date else 'NO'}")
            
            if has_specific_names and (has_contract_value or has_end_date):
                print("\n🎉 IMPROVEMENT SUCCESS! Groq now extracts specific details.")
            else:
                print("\n⚠️  Still needs improvement. Generic responses detected.")
        
        print(f"\nTotal processing time: {ocr_time + analysis_time:.2f} seconds")
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_groq_analysis())