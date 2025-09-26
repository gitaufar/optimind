#!/usr/bin/env python3
"""
Test konversi tanggal Indonesia
"""

import json
from services.groq_services import GroqService

def test_date_conversion():
    """Test date conversion function"""
    
    groq_service = GroqService()
    
    # Test data with Indonesian date format
    test_result = {
        "contract_name": "Test Contract",
        "contract_start_date": "Dua Puluh Bulan Februari Tahun Dua Ribu Dua Puluh Lima",
        "contract_end_date": "Tiga Puluh Satu Desember Dua Ribu Dua Puluh Lima",
        "first_party": {"name": "PT Test"}
    }
    
    print("=== TESTING DATE CONVERSION FUNCTION ===")
    print("Original dates:")
    print(f"Start: {test_result['contract_start_date']}")
    print(f"End: {test_result['contract_end_date']}")
    
    # Convert dates
    converted_result = groq_service._convert_indonesian_dates(test_result)
    
    print("\nConverted dates:")
    print(f"Start: {converted_result['contract_start_date']}")
    print(f"End: {converted_result['contract_end_date']}")
    
    # Check if conversion worked
    start_converted = converted_result['contract_start_date'] != test_result['contract_start_date']
    end_converted = converted_result['contract_end_date'] != test_result['contract_end_date']
    
    print(f"\nStart date converted: {'✓' if start_converted else '✗'}")
    print(f"End date converted: {'✓' if end_converted else '✗'}")
    
    if start_converted or end_converted:
        print("🎉 Date conversion working!")
    else:
        print("⚠️ Date conversion needs improvement")

if __name__ == "__main__":
    test_date_conversion()