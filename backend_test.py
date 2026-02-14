#!/usr/bin/env python3

import requests
import sys
import json
from datetime import datetime

class RealEstateAPITester:
    def __init__(self, base_url="https://discretion-homes.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0
        self.created_property_id = None

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {name}")
        if details:
            print(f"    {details}")
        if success:
            self.tests_passed += 1
        print()

    def test_api_root(self):
        """Test root API endpoint"""
        try:
            response = requests.get(f"{self.base_url}/", timeout=10)
            success = response.status_code == 200 and "Quiet Wealth Real Estate API" in response.text
            details = f"Status: {response.status_code}, Response: {response.json() if success else response.text}"
            self.log_test("API Root Endpoint", success, details)
            return success
        except Exception as e:
            self.log_test("API Root Endpoint", False, f"Error: {str(e)}")
            return False

    def test_seed_properties(self):
        """Test seeding properties"""
        try:
            response = requests.post(f"{self.base_url}/seed", timeout=15)
            success = response.status_code == 200
            data = response.json() if success else {}
            details = f"Status: {response.status_code}, Message: {data.get('message', response.text)}"
            self.log_test("Seed Properties", success, details)
            return success
        except Exception as e:
            self.log_test("Seed Properties", False, f"Error: {str(e)}")
            return False

    def test_get_properties(self):
        """Test getting all properties"""
        try:
            response = requests.get(f"{self.base_url}/properties", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else []
            property_count = len(data) if isinstance(data, list) else 0
            details = f"Status: {response.status_code}, Properties found: {property_count}"
            if property_count > 0:
                details += f", Sample: {data[0]['title'] if data else 'None'}"
            self.log_test("Get All Properties", success, details)
            return success, data
        except Exception as e:
            self.log_test("Get All Properties", False, f"Error: {str(e)}")
            return False, []

    def test_get_featured_properties(self):
        """Test getting featured properties"""
        try:
            response = requests.get(f"{self.base_url}/properties?featured=true", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else []
            featured_count = len([p for p in data if p.get('featured', False)]) if isinstance(data, list) else 0
            details = f"Status: {response.status_code}, Featured properties: {featured_count}"
            self.log_test("Get Featured Properties", success, details)
            return success
        except Exception as e:
            self.log_test("Get Featured Properties", False, f"Error: {str(e)}")
            return False

    def test_property_filtering(self):
        """Test property filtering functionality"""
        filters_to_test = [
            ("property_type", "estate"),
            ("property_type", "penthouse"),
            ("min_price", "30000000"),
            ("max_price", "35000000"),
            ("bedrooms", "5")
        ]
        
        all_passed = True
        for param, value in filters_to_test:
            try:
                response = requests.get(f"{self.base_url}/properties?{param}={value}", timeout=10)
                success = response.status_code == 200
                data = response.json() if success else []
                count = len(data) if isinstance(data, list) else 0
                details = f"Filter {param}={value}, Status: {response.status_code}, Results: {count}"
                self.log_test(f"Filter by {param}", success, details)
                all_passed = all_passed and success
            except Exception as e:
                self.log_test(f"Filter by {param}", False, f"Error: {str(e)}")
                all_passed = False
        
        return all_passed

    def test_get_property_by_id(self, property_id):
        """Test getting a specific property by ID"""
        try:
            response = requests.get(f"{self.base_url}/properties/{property_id}", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            details = f"Status: {response.status_code}"
            if success:
                details += f", Title: {data.get('title', 'N/A')}, Price: ${data.get('price', 0):,}"
            self.log_test("Get Property by ID", success, details)
            return success, data
        except Exception as e:
            self.log_test("Get Property by ID", False, f"Error: {str(e)}")
            return False, {}

    def test_create_property(self):
        """Test creating a new property"""
        test_property = {
            "title": "Test Property for API Testing",
            "location": "Test Location",
            "price": 5000000,
            "property_type": "apartment",
            "bedrooms": 3,
            "bathrooms": 2,
            "area": 2500,
            "description": "This is a test property created by the API tester.",
            "features": ["Test Feature 1", "Test Feature 2"],
            "images": ["https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200"],
            "featured": False
        }
        
        try:
            response = requests.post(f"{self.base_url}/properties", json=test_property, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            if success:
                self.created_property_id = data.get('id')
            details = f"Status: {response.status_code}"
            if success:
                details += f", Created ID: {self.created_property_id}"
            self.log_test("Create Property", success, details)
            return success
        except Exception as e:
            self.log_test("Create Property", False, f"Error: {str(e)}")
            return False

    def test_update_property(self):
        """Test updating a property"""
        if not self.created_property_id:
            self.log_test("Update Property", False, "No property ID to update")
            return False
        
        update_data = {
            "title": "Updated Test Property",
            "price": 5500000,
            "featured": True
        }
        
        try:
            response = requests.put(f"{self.base_url}/properties/{self.created_property_id}", 
                                  json=update_data, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            details = f"Status: {response.status_code}"
            if success:
                details += f", New title: {data.get('title', 'N/A')}, New price: ${data.get('price', 0):,}"
            self.log_test("Update Property", success, details)
            return success
        except Exception as e:
            self.log_test("Update Property", False, f"Error: {str(e)}")
            return False

    def test_create_inquiry(self):
        """Test creating an inquiry"""
        test_inquiry = {
            "name": "Test User",
            "email": "test@example.com",
            "phone": "555-0123",
            "message": "This is a test inquiry from the API tester.",
            "property_title": "Test Property Inquiry"
        }
        
        try:
            response = requests.post(f"{self.base_url}/inquiries", json=test_inquiry, timeout=10)
            success = response.status_code == 200
            data = response.json() if success else {}
            details = f"Status: {response.status_code}"
            if success:
                details += f", Inquiry ID: {data.get('id', 'N/A')}"
            self.log_test("Create Inquiry", success, details)
            return success, data.get('id') if success else None
        except Exception as e:
            self.log_test("Create Inquiry", False, f"Error: {str(e)}")
            return False, None

    def test_get_inquiries(self):
        """Test getting all inquiries"""
        try:
            response = requests.get(f"{self.base_url}/inquiries", timeout=10)
            success = response.status_code == 200
            data = response.json() if success else []
            inquiry_count = len(data) if isinstance(data, list) else 0
            details = f"Status: {response.status_code}, Inquiries found: {inquiry_count}"
            self.log_test("Get All Inquiries", success, details)
            return success, data
        except Exception as e:
            self.log_test("Get All Inquiries", False, f"Error: {str(e)}")
            return False, []

    def test_delete_inquiry(self, inquiry_id):
        """Test deleting an inquiry"""
        if not inquiry_id:
            self.log_test("Delete Inquiry", False, "No inquiry ID to delete")
            return False
        
        try:
            response = requests.delete(f"{self.base_url}/inquiries/{inquiry_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            self.log_test("Delete Inquiry", success, details)
            return success
        except Exception as e:
            self.log_test("Delete Inquiry", False, f"Error: {str(e)}")
            return False

    def test_delete_property(self):
        """Test deleting the created property"""
        if not self.created_property_id:
            self.log_test("Delete Property", False, "No property ID to delete")
            return False
        
        try:
            response = requests.delete(f"{self.base_url}/properties/{self.created_property_id}", timeout=10)
            success = response.status_code == 200
            details = f"Status: {response.status_code}"
            self.log_test("Delete Property", success, details)
            return success
        except Exception as e:
            self.log_test("Delete Property", False, f"Error: {str(e)}")
            return False

    def run_all_tests(self):
        """Run comprehensive API testing"""
        print("🔍 Starting Real Estate API Testing...")
        print(f"Base URL: {self.base_url}")
        print("=" * 60)
        
        # Basic connectivity
        if not self.test_api_root():
            print("❌ API root endpoint failed - stopping tests")
            return self.get_results()
        
        # Seed data
        self.test_seed_properties()
        
        # Property operations
        success, properties = self.test_get_properties()
        if success and properties:
            # Test with first property
            self.test_get_property_by_id(properties[0]['id'])
        
        self.test_get_featured_properties()
        self.test_property_filtering()
        
        # CRUD operations
        self.test_create_property()
        self.test_update_property()
        
        # Inquiry operations
        inquiry_success, inquiry_id = self.test_create_inquiry()
        self.test_get_inquiries()
        if inquiry_id:
            self.test_delete_inquiry(inquiry_id)
        
        # Cleanup
        self.test_delete_property()
        
        return self.get_results()

    def get_results(self):
        """Get test results summary"""
        success_rate = (self.tests_passed / self.tests_run * 100) if self.tests_run > 0 else 0
        
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed ({success_rate:.1f}%)")
        
        if success_rate == 100:
            print("🎉 All backend tests passed!")
        elif success_rate >= 80:
            print("⚠️  Most tests passed - minor issues found")
        else:
            print("❌ Critical backend issues found")
        
        return {
            "tests_run": self.tests_run,
            "tests_passed": self.tests_passed,
            "success_rate": success_rate,
            "all_passed": success_rate == 100
        }

def main():
    tester = RealEstateAPITester()
    results = tester.run_all_tests()
    return 0 if results["all_passed"] else 1

if __name__ == "__main__":
    sys.exit(main())