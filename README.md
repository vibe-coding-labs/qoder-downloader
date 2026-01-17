# Qoder Downloader



一个用Go语言编写的命令行工具，用于探测和发现 Qoder 编辑器的可用版本。
目前所有可用安装文件已经下载好上传到了Release，请君自取，或者clone此工具自行编译下载。

## 在线版本

浏览所有可用的 Qoder 版本及其下载链接：[Qoder 版本下载中心](https://vibe-coding-labs.github.io/qoder-downloader)

## 功能特性

- 🔍 **版本探测**: 自动探测 `https://download.qoder.com/release/` 下的所有可用版本
- 💾 **智能缓存**: 本地缓存已探测的版本信息，避免重复请求
- ⚡ **高效检测**: 支持并发检测，快速获取结果
- 🎯 **精确控制**: 可指定版本范围或检测特定版本
- 📊 **统计信息**: 提供缓存统计和检测进度信息

## 安装

### 从源码构建

```bash
git clone https://github.com/vibe-coding-labs/qoder-downloader.git
cd qoder-downloader
go build -o qoder-downloader
```

### 直接运行

```bash
go run main.go detect
```

## 使用方法

### 基本用法

```bash
# 探测所有可用版本（默认范围：0.0.0 到 2.10.20）
./qoder-downloader detect

# 显示详细输出
./qoder-downloader detect --verbose
```

### 自定义探测范围

```bash
# 自定义版本范围
./qoder-downloader detect --max-major 1 --max-minor 5 --max-patch 10

# 检测特定版本
./qoder-downloader detect --version 0.1.0
```

### 缓存管理

```bash
# 显示缓存的版本（不进行网络请求）
./qoder-downloader detect --show-cached

# 显示缓存统计信息
./qoder-downloader detect --stats

# 清空缓存
./qoder-downloader detect --clear-cache

# 设置缓存过期时间（小时）
./qoder-downloader detect --cache-ttl 48
```

### 配置选项

```bash
# 指定缓存目录
./qoder-downloader detect --cache-dir /path/to/cache

# 使用配置文件
./qoder-downloader detect --config /path/to/config.yaml
```

## 输出示例

```
Starting version detection (max: 2.10.20)...
Generated 462 version candidates
Progress: 462/462 (100.0%)

Detection completed in 2m15s
Checked: 123 versions, Skipped (cached): 339 versions
Found 8 available versions:

   1. 0.1.0
   2. 0.1.1
   3. 0.1.2
   4. 0.2.0
   5. 0.2.1
   6. 0.3.0
   7. 0.3.1
   8. 0.4.0

Latest version: 0.4.0

Download URLs for 0.4.0:
  https://download.qoder.com/release/0.4.0/Qoder-darwin-arm64.dmg
  https://download.qoder.com/release/0.4.0/Qoder-darwin-x64.dmg
  https://download.qoder.com/release/0.4.0/Qoder-linux-x64.tar.gz
  https://download.qoder.com/release/0.4.0/Qoder-win32-x64.zip
```

## 缓存机制

工具会在以下位置创建缓存：
- 默认位置: `$HOME/.qoder-downloader/versions.json`
- 自定义位置: 通过 `--cache-dir` 参数指定

缓存包含以下信息：
- 版本号
- 是否存在
- 检测时间
- 过期时间（TTL）

## 配置文件

支持 YAML 格式的配置文件，默认位置：`$HOME/.qoder-downloader.yaml`

```yaml
verbose: true
cache-dir: "/custom/cache/path"
cache-ttl: 24
max-major: 2
max-minor: 10
max-patch: 20
```

## 命令行选项

| 选项 | 描述 | 默认值 |
|------|------|--------|
| `--max-major` | 最大主版本号 | 2 |
| `--max-minor` | 最大次版本号 | 10 |
| `--max-patch` | 最大补丁版本号 | 20 |
| `--version` | 检测特定版本 | - |
| `--show-cached` | 显示缓存版本 | false |
| `--clear-cache` | 清空缓存 | false |
| `--stats` | 显示统计信息 | false |
| `--cache-ttl` | 缓存过期时间（小时） | 24 |
| `--cache-dir` | 缓存目录 | `$HOME/.qoder-downloader` |
| `--verbose` | 详细输出 | false |
| `--config` | 配置文件路径 | `$HOME/.qoder-downloader.yaml` |

## 技术实现

- **语言**: Go 1.21+
- **CLI框架**: Cobra
- **配置管理**: Viper
- **HTTP客户端**: 标准库 net/http
- **缓存格式**: JSON

## 许可证

本项目采用 MIT 许可证，详见 [LICENSE](LICENSE) 文件。

## 贡献

欢迎提交 Issue 和 Pull Request！

## 更新日志

### v1.0.0
- 初始版本发布
- 支持版本探测和缓存功能
- 提供完整的命令行界面