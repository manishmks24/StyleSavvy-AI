"""
Installation Checker for StyleSavvy AI
Verifies that all requirements are met before running the application
"""

import sys
import os
import subprocess
from pathlib import Path

def print_colored(text, color='green'):
    """Print colored text"""
    colors = {
        'green': '\033[92m',
        'red': '\033[91m',
        'yellow': '\033[93m',
        'blue': '\033[94m',
        'reset': '\033[0m'
    }
    print(f"{colors.get(color, '')}{text}{colors['reset']}")

def check_python_version():
    """Check Python version"""
    print("\n1. Checking Python version...")
    version = sys.version_info
    if version.major >= 3 and version.minor >= 8:
        print_colored(f"   ✓ Python {version.major}.{version.minor}.{version.micro} (OK)", 'green')
        return True
    else:
        print_colored(f"   ✗ Python {version.major}.{version.minor}.{version.micro} (Need 3.8+)", 'red')
        return False

def check_pip():
    """Check if pip is installed"""
    print("\n2. Checking pip...")
    try:
        result = subprocess.run(['pip', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            print_colored(f"   ✓ pip is installed", 'green')
            return True
    except:
        pass
    
    print_colored(f"   ✗ pip not found", 'red')
    return False

def check_requirements():
    """Check if all Python packages are installed"""
    print("\n3. Checking required packages...")
    required = [
        'flask',
        'flask_cors',
        'kagglehub',
        'pandas',
        'scikit-learn',
        'numpy'
    ]
    
    all_installed = True
    for package in required:
        try:
            __import__(package.replace('-', '_'))
            print_colored(f"   ✓ {package}", 'green')
        except ImportError:
            print_colored(f"   ✗ {package} (not installed)", 'red')
            all_installed = False
    
    if not all_installed:
        print_colored("\n   Install missing packages with:", 'yellow')
        print_colored("   pip install -r requirements.txt", 'yellow')
    
    return all_installed

def check_kaggle_credentials():
    """Check if Kaggle credentials are configured"""
    print("\n4. Checking Kaggle credentials...")
    
    kaggle_dir = Path.home() / '.kaggle'
    kaggle_json = kaggle_dir / 'kaggle.json'
    
    if kaggle_json.exists():
        print_colored(f"   ✓ Kaggle credentials found at {kaggle_json}", 'green')
        return True
    else:
        print_colored(f"   ✗ Kaggle credentials not found", 'red')
        print_colored(f"\n   Setup instructions:", 'yellow')
        print_colored(f"   1. Go to https://www.kaggle.com/settings", 'yellow')
        print_colored(f"   2. Create a new API token", 'yellow')
        print_colored(f"   3. Download kaggle.json", 'yellow')
        print_colored(f"   4. Place it at: {kaggle_json}", 'yellow')
        return False

def check_node():
    """Check if Node.js is installed"""
    print("\n5. Checking Node.js (for frontend)...")
    try:
        result = subprocess.run(['node', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_colored(f"   ✓ Node.js {version}", 'green')
            return True
    except:
        pass
    
    print_colored(f"   ✗ Node.js not found", 'red')
    print_colored(f"   Install from: https://nodejs.org/", 'yellow')
    return False

def check_npm():
    """Check if npm is installed"""
    print("\n6. Checking npm...")
    try:
        result = subprocess.run(['npm', '--version'], capture_output=True, text=True)
        if result.returncode == 0:
            version = result.stdout.strip()
            print_colored(f"   ✓ npm {version}", 'green')
            return True
    except:
        pass
    
    print_colored(f"   ✗ npm not found", 'red')
    return False

def check_port_5000():
    """Check if port 5000 is available"""
    print("\n7. Checking port 5000 availability...")
    import socket
    
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('localhost', 5000))
    sock.close()
    
    if result != 0:
        print_colored(f"   ✓ Port 5000 is available", 'green')
        return True
    else:
        print_colored(f"   ⚠ Port 5000 is in use", 'yellow')
        print_colored(f"   The backend might already be running, or another service is using this port", 'yellow')
        return True  # Not a blocker

def main():
    """Main function"""
    print_colored("=" * 60, 'blue')
    print_colored("  StyleSavvy AI - Installation Checker", 'blue')
    print_colored("=" * 60, 'blue')
    
    checks = [
        check_python_version(),
        check_pip(),
        check_requirements(),
        check_kaggle_credentials(),
        check_node(),
        check_npm(),
        check_port_5000(),
    ]
    
    print_colored("\n" + "=" * 60, 'blue')
    print_colored("  Summary", 'blue')
    print_colored("=" * 60, 'blue')
    
    passed = sum(checks)
    total = len(checks)
    
    if passed == total:
        print_colored(f"\n✓ All checks passed! ({passed}/{total})", 'green')
        print_colored("\nYou're ready to run StyleSavvy AI!", 'green')
        print_colored("\nNext steps:", 'blue')
        print_colored("1. Start the backend: python app.py", 'blue')
        print_colored("2. Start the frontend: npm run dev (in another terminal)", 'blue')
    else:
        print_colored(f"\n⚠ {total - passed} check(s) failed ({passed}/{total} passed)", 'yellow')
        print_colored("\nPlease fix the issues above before running the application.", 'yellow')
    
    print()

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\n\nCheck cancelled by user.")
        sys.exit(0)
    except Exception as e:
        print(f"\n\nError during check: {e}")
        sys.exit(1)
