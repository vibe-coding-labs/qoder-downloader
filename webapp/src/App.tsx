import React from 'react';
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
            <a href="https://github.com/vibe-coding-labs/qoder-downloader" target="_blank" rel="noopener noreferrer">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ verticalAlign: 'middle', color: 'white' }}>
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
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

export default App;