import React, { useEffect } from 'react';
import { Layout, Typography, Card, Collapse, Tag, Space, Button, Statistic, Row, Col } from 'antd';
import { DownloadOutlined, CheckCircleOutlined, ClockCircleOutlined, DesktopOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

// 定义类型
interface Platform {
  os: string;
  arch: string;
  ext: string;
  url: string;
}

interface Version {
  version: string;
  platforms: Platform[];
}

const App: React.FC = () => {
  // 版本数据
  const versions = [
    { version: "0.2.29", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.29/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.29/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.29/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.29/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.28", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.28/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.28/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.28/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.28/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.27", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.27/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.27/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.27/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.27/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.26", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.26/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.26/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.26/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.26/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.25", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.25/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.25/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.25/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.25/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.24", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.24/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.24/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.24/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.24/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.23", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.23/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.23/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.23/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.23/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.22", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.22/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.22/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.22/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.22/Qoder-win32-x64.zip" }
    ]},
    { version: "0.2.21", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.2.21/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.2.21/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.2.21/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.2.21/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.23", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.23/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.23/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.23/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.23/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.22", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.22/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.22/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.22/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.22/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.21", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.21/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.21/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.21/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.21/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.20", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.20/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.20/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.20/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.20/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.19", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.19/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.19/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.19/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.19/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.18", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.18/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.18/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.18/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.18/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.17", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.17/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.17/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.17/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.17/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.16", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.16/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.16/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.16/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.16/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.15", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.15/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.15/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.15/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.15/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.13", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.13/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.13/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.13/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.13/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.12", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.12/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.12/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.12/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.12/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.11", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.11/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.11/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.11/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.11/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.10", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.10/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.10/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.10/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.10/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.9", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.9/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.9/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.9/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.9/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.8", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.8/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.8/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.8/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.8/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.7", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.7/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.7/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.7/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.7/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.6", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.6/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.6/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.6/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.6/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.5", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.5/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.5/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.5/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.5/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.4", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.4/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.4/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.4/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.4/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.3", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.3/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.3/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.3/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.3/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.1", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.1/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.1/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.1/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.1/Qoder-win32-x64.zip" }
    ]},
    { version: "0.1.0", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.1.0/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.1.0/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.1.0/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.1.0/Qoder-win32-x64.zip" }
    ]},
    { version: "0.0.1", platforms: [
      { os: "macOS", arch: "ARM64", ext: "dmg", url: "https://download.qoder.com/release/0.0.1/Qoder-darwin-arm64.dmg" },
      { os: "macOS", arch: "x64", ext: "dmg", url: "https://download.qoder.com/release/0.0.1/Qoder-darwin-x64.dmg" },
      { os: "Linux", arch: "x64", ext: "tar.gz", url: "https://download.qoder.com/release/0.0.1/Qoder-linux-x64.tar.gz" },
      { os: "Windows", arch: "x64", ext: "zip", url: "https://download.qoder.com/release/0.0.1/Qoder-win32-x64.zip" }
    ]}
  ]; // 计算统计数据
  const totalVersions = versions.length;
  const latestVersion = versions.length > 0 ? versions[0].version : 'N/A';
  const platformTypes = [...new Set(versions.flatMap((v: Version) => v.platforms.map((p: Platform) => p.os)))].length;

  // 按版本号排序（降序，最新版本在前）
  const sortedVersions = [...versions].sort((a, b) => {
    const [aMajor, aMinor, aPatch] = a.version.split('.').map(Number);
    const [bMajor, bMinor, bPatch] = b.version.split('.').map(Number);
    
    if (aMajor !== bMajor) return bMajor - aMajor;
    if (aMinor !== bMinor) return bMinor - aMajor;
    return bPatch - aPatch;
  });

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', padding: '0 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Title style={{ lineHeight: '64px', margin: 0, color: 'white' }} level={3}>
            <DesktopOutlined /> Qoder 版本下载中心
          </Title>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <Text style={{ color: 'rgba(255, 255, 255, 0.85)' }}>现代化的版本管理界面</Text>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <a 
                href="https://github.com/vibe-coding-labs/qoder-downloader" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ textDecoration: 'none' }}
                title="给我们的项目点赞!"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: 'white' }}>
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                  <path d="M9 18c-4.51 2-5-2-7-2" />
                </svg>
                <span style={{ marginLeft: '4px', color: 'white', fontSize: '14px' }} id="github-stars">0</span>
              </a>
              <div 
                id="star-tooltip"
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#191c24',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '12px',
                  whiteSpace: 'nowrap',
                  zIndex: 1000,
                  opacity: 0,
                  transition: 'opacity 0.2s',
                  pointerEvents: 'none',
                  marginBottom: '4px'
                }}
              >
                给我们的项目点赞!
              </div>
            </div>
          </div>
        </div>
      </Header>
      
      <Content style={{ padding: '20px 50px', backgroundColor: '#f0f2f5' }}>
        <div style={{ marginBottom: 20 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="总版本数" 
                  value={totalVersions} 
                  prefix={<CheckCircleOutlined />}
                  valueStyle={{ color: '#3f8600' }}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="最新版本" 
                  value={latestVersion} 
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: '#1890ff' }}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic 
                  title="支持平台" 
                  value={platformTypes} 
                  prefix={<DesktopOutlined />}
                  valueStyle={{ color: '#722ed1' }}
                  style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                  }}
                />
              </Card>
            </Col>
          </Row>
        </div>
        
        <Card 
          title="版本列表" 
          style={{ 
            marginBottom: 20,
            boxShadow: 'none',
            border: 'none',
            background: 'transparent'
          }}
        >
          <Paragraph>
            点击版本号展开查看该版本的下载链接，支持 macOS、Windows、Linux 平台。
          </Paragraph>
          
          <Collapse accordion>
            {sortedVersions.map((versionData) => (
              <Panel 
                header={
                  <Space size="middle">
                    <Text strong style={{ fontSize: '16px' }}>{versionData.version}</Text>
                    <Tag color="blue">最新版</Tag>
                  </Space>
                } 
                key={versionData.version}
              >
                <Row gutter={[16, 16]}>
                  {versionData.platforms.map((platform, index) => (
                    <Col span={24} key={index}>
                      <Card 
                        size="small" 
                        style={{ 
                          boxShadow: 'none',
                          border: '1px solid #e8e8e8',
                          borderRadius: '4px',
                          background: '#fafafa'
                        }}
                        actions={[<Button 
                            type="text" 
                            icon={<DownloadOutlined />} 
                            href={platform.url}
                            target="_blank"
                            style={{ color: '#1890ff' }}
                          >
                            下载
                          </Button>]
                        }
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          <Space>
                            <Tag color="geekblue">{platform.os}</Tag>
                            <Tag color="green">{platform.arch}</Tag>
                            <Tag color="orange">{platform.ext}</Tag>
                          </Space>
                          <div style={{ width: '100%' }}>
                            <div>
                              <Text strong>官方:</Text> <Text code>{platform.url}</Text>
                            </div>
                            <div>
                              <Text strong>备用:</Text> <Text code>{`https://github.com/vibe-coding-labs/qoder-downloader/releases/download/v${versionData.version}/qoder-${versionData.version}-${platform.os.toLowerCase()}-${platform.arch}.${platform.ext}`}</Text>
                            </div>
                          </div>
                        </Space>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </Panel>
            ))}
          </Collapse>
        </Card>
      </Content>
      
      <Footer style={{ textAlign: 'center', backgroundColor: '#f0f2f5', borderTop: '1px solid #e8e8e8' }}>
        Qoder 版本下载中心 ©{new Date().getFullYear()} - 提供所有版本的下载链接
        <div style={{ marginTop: 16 }}>
          <Space>
            <a href="https://github.com/vibe-coding-labs/qoder-downloader/releases" target="_blank" rel="noopener noreferrer">GitHub Releases</a>
            <span>|</span>
            <a href="https://github.com/vibe-coding-labs/qoder-downloader" target="_blank" rel="noopener noreferrer">项目仓库</a>
          </Space>
        </div>
      </Footer>
    </Layout>
  );
};

// 获取GitHub仓库Star数的函数
const fetchGitHubStars = async () => {
  // 检查缓存
  const cacheKey = 'github-stars-cache';
  const cachedData = localStorage.getItem(cacheKey);
  
  if (cachedData) {
    const { stars, timestamp } = JSON.parse(cachedData);
    const now = new Date().getTime();
    
    // 如果缓存未过期（1小时内），则使用缓存数据
    if (now - timestamp < 60 * 60 * 1000) { // 1小时 = 3600000毫秒
      return stars;
    }
  }
  
  try {
    const response = await fetch('https://api.github.com/repos/vibe-coding-labs/qoder-downloader');
    const data = await response.json();
    const stars = data.stargazers_count;
    
    // 存储到缓存
    localStorage.setItem(cacheKey, JSON.stringify({
      stars,
      timestamp: new Date().getTime()
    }));
    
    return stars;
  } catch (error) {
    console.error('获取GitHub Star数失败:', error);
    return 0; // 返回0表示获取失败
  }
};

// 组件挂载后获取Star数
useEffect(() => {
  const loadStars = async () => {
    const stars = await fetchGitHubStars();
    const starsElement = document.getElementById('github-stars');
    if (starsElement) {
      starsElement.textContent = stars.toString();
    }
  };
  
  loadStars();
  
  // 为GitHub徽标添加悬停事件
  const githubLink = document.querySelector('#root a[href="https://github.com/vibe-coding-labs/qoder-downloader"]') as HTMLAnchorElement;
  if (githubLink) {
    const tooltip = githubLink.querySelector('#star-tooltip') as HTMLElement;
    if (tooltip) {
      githubLink.addEventListener('mouseenter', () => {
        tooltip.style.opacity = '1';
      });
      
      githubLink.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
      });
    }
  }
}, []);

export default App;