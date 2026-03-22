# KinnectFi EC2 Deployment & Remote Demo Guide

This guide explains how to host the KinnectFi Expo demo on an AWS EC2 instance and share it with anyone using the Expo Go app and a tunnel.

## 1. EC2 Instance Setup

### Security Group Configuration
Ensure your EC2 Security Group allows the following inbound traffic:
- **Port 8081**: Default Expo packager port (TCP).
- **Port 19000-19006**: (Optional) For older Expo versions.
- **SSH (Port 22)**: For your access.

### Environment Preparation
Connect to your EC2 instance and install the necessary tools:
```bash
# Update and install Node.js (if not present)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install global dependencies
sudo npm install -g expo-cli
```

## 2. Running the Demo with Tunnel

Navigate to the project directory (`fe`) and follow these steps:

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Expo Tunnel
Run the following command to start the development server with a tunnel. This bypasses firewall issues and provides a shareable URL.
```bash
npx expo start --tunnel
```
> [!NOTE]
> The first time you run this, it may ask you to install `@expo/ngrok`. Type `y` to proceed.

### Step 3: Share the Link
Once the tunnel starts, you will see a URL like `exp://u-v.w.x.y.z.exp.direct:80`. Share this link with your friend.

## 3. Validation Steps

### Browser Validation (Public IP)
Before sharing, you can verify the packager is running by visiting your EC2 Public IP in a browser:
1. Find your **EC2 Public IPv4 address** from the AWS Console.
2. Open your browser and go to: `http://<YOUR_EC2_PUBLIC_IP>:8081/status`
3. If you see `packager-status:running`, the server is active.

### Expo Go App Validation
1. Install the **Expo Go** app on your iOS or Android device.
2. **Android**: Scan the QR code generated in the EC2 terminal.
3. **iOS**: 
   - Open the Camera app and scan the QR code, OR
   - Open the Expo Go app, go to the "Browse" tab, and enter the `exp://...` URL manually.

## 4. Troubleshooting
- **Tunnel not starting**: Ensure you have a stable internet connection on the EC2 instance.
- **Connection Timeout**: Double-check that Port 8081 is open in the AWS Security Group.
- **Node Version**: Ensure you are using Node 16 or higher.
