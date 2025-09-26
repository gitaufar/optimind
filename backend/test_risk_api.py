#!/usr/bin/env python3
"""
Test script untuk Risk Management API
"""

import asyncio
import json
from services.risk_services import RiskAnalysisService

async def test_risk_analysis():
    """Test risk analysis service"""
    
    # Sample contract text dengan berbagai risk factors
    sample_contract = """
    SURAT PERJANJIAN KERJA KONSTRUKSI
    
    Pihak Pertama: PT Pembangunan Jaya
    Pihak Kedua: CV Kontraktor Prima
    
    Nilai Kontrak: Rp 5.000.000.000,00
    Jangka Waktu: 12 bulan
    
    KEWAJIBAN DAN TANGGUNG JAWAB:
    1. Kontraktor bertanggung jawab penuh atas keselamatan kerja
    2. Apabila terjadi keterlambatan penyelesaian, kontraktor dikenakan denda 1% per hari
    3. Dalam hal terjadi force majeure seperti bencana alam, kontrak dapat dihentikan sementara
    4. Kontraktor wajib memberikan garansi 2 tahun untuk struktur bangunan
    5. Segala kerusakan akibat kelalaian kontraktor menjadi tanggung jawab kontraktor
    
    SANKSI DAN PENALTY:
    - Denda keterlambatan: 1% dari nilai kontrak per hari
    - Pembatalan kontrak dapat dilakukan jika keterlambatan lebih dari 30 hari
    - Ganti rugi untuk kerusakan: sesuai dengan kerugian yang ditimbulkan
    
    Kontrak ini tunduk pada peraturan yang berlaku di Indonesia.
    """
    
    print("=== TESTING RISK ANALYSIS SERVICE ===")
    print(f"Sample contract length: {len(sample_contract)} characters")
    
    try:
        # Initialize risk service
        risk_service = RiskAnalysisService()
        
        # Check model info first
        print("\n1. Checking model info...")
        model_info = risk_service.get_model_info()
        print("Model Info:")
        print(json.dumps(model_info, indent=2, ensure_ascii=False))
        
        if not model_info.get("model_available", False):
            print("❌ Risk analysis model not available")
            return
        
        # Perform risk analysis
        print("\n2. Performing risk analysis...")
        result = await risk_service.analyze_contract_risk(sample_contract)
        
        print("Risk Analysis Result:")
        print(json.dumps(result, indent=2, ensure_ascii=False))
        
        # Analyze results
        if result.get("success"):
            print(f"\n=== ANALYSIS SUMMARY ===")
            print(f"Risk Level: {result['risk_level']}")
            print(f"Confidence: {result['confidence']:.1%}")
            print(f"Risk Factors Found: {len(result['risk_factors'])}")
            
            print(f"\nRisk Factors:")
            for factor in result['risk_factors']:
                print(f"  - {factor['description']} ({factor['severity']})")
                print(f"    Keywords: {', '.join(factor['found_keywords'])}")
            
            print(f"\nRecommendations:")
            for rec in result['risk_assessment']['recommendations']:
                print(f"  • {rec}")
                
            print("\n🎉 Risk analysis completed successfully!")
        else:
            print(f"❌ Risk analysis failed: {result.get('error', 'Unknown error')}")
            
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test_risk_analysis())