# 一、项目介绍

> 本项目是一个基于大语言模型 DeepSeek 和 GLM 的前端 AI 助手应用，旨在通过自然语言处理技术为用户提供智能问答、代码生成、文档检索等功能。
>
>
>
> ### 依赖安装（使用之前必看）：
> 为实现项目核心功能和与大预言模型通信，保障项目兼容性和性能，遵循项目架构设计，来确保llm-chat-1项目能够正常运行，我们需要安装相关依赖，相关依赖版本请参阅文件根目录下的package.json文件，下面是安装依赖的具体步骤：
> 框架准备：在执行命令行之前，请提前安装Node.js框架。
> 
>       http://localhost:5173/
> 1. **将项目克隆到本地：** 打开终端，运行git clone https://github.com/yin28-sheep/llm-chat-1
> 2. 导航到项目文件：cd llm-chat-1
> 3. **安装依赖：** 运行npm install
> 4. **启动开发服务器：** npm run dev
> 5. **运行程序：** 打开项目服务地址https://github.com/yin28-sheep/llm-chat-1
>
>
>   ### 项目地址 - https://github.com/yin28-sheep/llm-chat-1

# 二、项目分工

| **团队成员** | **主要贡献**                                                 |
| ------------ | ------------------------------------------------------------ |
| 张嘉文     | 梳理项目开发需求、封装工具类、技术选型、负责 LLM 接口调用。|
| 殷郝月     | 成员技术能力调查、项目整体组件架构、文档编写、项目架构优化。            |
| 王菲       | 项目功能开发、技术补充、项目整体样式布局、功能测试。                 |

# 三、项目实现

### 3.1 技术选型与相关开发文档

技术栈

- **前端**：  Vue3 + Vite + TypeScript + Pinia +  Axios + Fetch API  。
- **LLM 模型**：OpenAI SDK + GLM SDK。

#### 场景分析

- **存储需求**：每日新增对话数据约 1 GB，预计存储空间需求为 100 GB / 月。
- **服务器需求**：1 台 8 核 16GB 服务器，用于前端服务

### 3.2 架构设计

#### 项目整体：

\- 除 Web 端外，组件还需兼容 H5 、小程序形态，准备通过整体响应式设计解决。

\- 提交相关功能演示材料。

\- 支持内联与独立对话两种功能模式，其中内联形态要求三种形态：收缩形态、展开形态、对话形态。

####   用户输入：

\- 上传文件，用户端和 AI 结果都要支持文本、图片、PDF 等多种交流的文件格式。

\- 根据用户输入（含文件）调用 Coze API 或其他大模型。

\- 实现回车发送消息，用户输入对话回车后，调用 LLM 接口，组件内流式展示大模型返回的结果。

####   AI返回结果：

\- 支持 LLM 流式返回结果，实现逐行打印效果。

\- 正确展示 文本、Markdown 、图片等 这些 LLM 返回的格式内容。

\- 返回结果包含代码，提供 `Copy` 按钮，方便用户复制代码。

####   LLM 模型选择：

基于成本经济性、稳定性和响应速度等方面的考量, 在大模型API采用不同平台的方案:

\- 语言交流模型接口调用"讯飞星辰MaaS平台"云部署的DeepSeek-V3模型

\- 图片文档解析接口调用"智谱AI开放平台"的GLM-4V-Plus-0111模型

### 3.3 项目代码介绍

### 前端组件结构与交互

- 主页面布局：采用 `flex` 布局实现左右分栏结构，主要由 `SideBar` 组件和 `Main` 组件构成。
  - `SideBar` 组件：位于左侧，作为消息历史记录组件，可能用于展示用户与 AI 的对话历史记录等信息。
  - `Main` 组件：位于右侧的主界面容器，负责三种形态（收缩形态、展开形态、对话形态）的切换，这可能与不同的交互场景或用户需求相对应。

1. 组件的兼容性设计

- 跨平台兼容：除 Web 端外，组件还需兼容 H5、小程序形态，准备通过整体响应式设计解决。这意味着组件的设计需要考虑不同平台的屏幕尺寸、交互方式等因素，确保在各种平台上都能提供一致的用户体验。
- 响应式设计：可能会使用 Vue3 提供的响应式系统以及 CSS 的媒体查询等技术，根据不同的设备屏幕尺寸和特性，动态调整组件的布局和样式。

1. 功能模块与组件关联

#### 用户输入相关

- 文件上传：用户端和 AI 结果都要支持文本、图片、PDF 等多种交流的文件格式。可能会有专门的文件上传组件，用于处理用户上传的文件，并将其传递给后端进行处理或直接与 LLM 模型进行交互。
- 输入处理与接口调用：根据用户输入（含文件）调用 Coze API 或其他大模型。当用户在输入框中输入对话并回车后，会触发相应的事件，调用 LLM 接口。这可能涉及到一个输入框组件，以及一个负责处理输入并进行接口调用的逻辑组件。

#### AI 返回结果处理

- 流式展示：支持 LLM 流式返回结果，实现逐行打印效果。需要一个专门的组件来处理和展示流式数据，可能会使用 Vue3 的响应式数据绑定和异步更新机制，实时更新界面以展示逐行返回的结果。
- 格式支持：正确展示文本、Markdown、图片等 LLM 返回的格式内容。这可能需要根据不同的返回格式，使用不同的组件进行渲染，例如使用 Markdown 解析器组件来渲染 Markdown 内容，使用图片展示组件来显示图片。
- 代码复制功能：如果返回结果包含代码，提供 `Copy` 按钮，方便用户复制代码。可能会在代码展示组件中添加一个复制按钮，点击按钮时调用浏览器的复制 API 实现代码复制功能。

1. 状态管理与数据流动

- Pinia：项目中使用了 Pinia 进行状态管理。各个组件之间可能通过 Pinia 存储和共享数据，例如用户的输入历史、AI 返回的结果等。组件可以通过订阅 Pinia 中的状态变化来实时更新界面，确保数据的一致性和同步性。

1. 架构分层

- 视图层：由各种 Vue 组件构成，负责用户界面的展示和交互，如 `SideBar`、`Main` 等组件。
- 逻辑层：处理用户输入、调用 LLM 接口、处理返回结果等业务逻辑，可能会有一些服务类或工具函数来封装这些逻辑。
- 数据层：使用 Pinia 管理应用的状态数据，以及与后端或 LLM 模型进行数据交互。

1. 整体流程示例

1. 用户在 `Main` 组件的输入框中输入对话或上传文件。
2. 输入数据通过逻辑层进行处理，调用相应的 LLM 接口（如讯飞星辰 MaaS 平台的 DeepSeek - V3 模型接口或智谱 AI 开放平台的 GLM - 4V - Plus - 0111 模型接口）。
3. LLM 模型返回结果，逻辑层对结果进行处理，将数据存储到 Pinia 中。
4. 视图层的组件（如 `Main` 组件）订阅 Pinia 中的数据变化，实时更新界面，展示流式结果、不同格式的内容等。

# 四、测试结果

## 1、测试目标

对基于大语言模型 DeepSeek 和 GLM 的前端 AI 助手应用进行功能测试和性能测试，以确保其功能的正确性和性能的可靠性。

## 2、测试环境

- 项目服务地址：http://localhost:5173/
- 项目地址：https://github.com/Sciencekex/llm-chat
- 服务器配置：1 台 8 核 16GB 服务器，用于前端服务

## 3、功能测试

### 3.1 测试用例设计

| **测试用例编号** | **测试功能点** | **测试步骤** | **预期结果** |
|:----------- |:---------- |:-------- |:--------|
|1          |  兼容性测试  | 分别在 Web 端、H5 端、小程序端打开项目|  各端均能正常显示项目页面，无明显布局错乱  |
|2          |  内联对话模式测试 | 切换到内联对话模式，查看收缩形态、展开形态、对话形态  | 三种形态可正常切换，界面显示正常  |
|3          |   文件上传功能测试 | 上传文本、图片、PDF 等格式的文件  |  文件上传成功，用户端和 AI 结果能正确显示相应文件 |
|4          |   LLM 接口调用测试 | 输入对话内容或上传文件后回车 |  成功调用 LLM 接口，组件内流式展示大模型返回的结果   |
|5          |   LLM 流式返回测试 | 触发 LLM 接口调用，观察返回结果 | 支持流式返回结果，实现逐行打印效果 |
|6          |  多种格式内容展示测试 | 查看 LLM 返回的文本、Markdown、图片等格式内容 | 各种格式内容均能正确展示 |
|7         |  代码复制功能测试    |  查看包含代码的返回结果，点击 Copy 按钮  |  代码能被成功复制 |

### 3.2 测试结果分析

- 兼容性测试：在 Web 端项目页面显示正常，但在 H5 端和小程序端部分样式存在错乱问题，未完全实现整体响应式设计。
- 内联对话模式测试：收缩形态、展开形态、对话形态切换基本正常，但在切换过程中存在短暂的界面闪烁问题。
- 文件上传功能测试：文本和图片文件上传正常，但 PDF 文件上传时偶尔会出现上传失败的情况，提示错误信息不明确。
- LLM 接口调用测试：输入对话内容回车后能正常调用 LLM 接口，但上传文件后调用接口有时会出现超时问题。
- LLM 流式返回测试：流式返回结果基本正常，但在网络不稳定的情况下，逐行打印会出现卡顿现象。
- 多种格式内容展示测试：文本和 Markdown 格式内容展示正常，但图片格式内容在某些情况下加载缓慢。
- 代码复制功能测试：`Copy` 按钮能正常触发复制功能，但在复制较长代码时偶尔会出现复制不完整的情况。

## 4、性能测试

### 4.1 测试用例设计

| **测试用例编号** | **测试功能点** | **测试步骤** | **预期结果** |
|:----------- |:---------- |:-------- |:--------|
|1            | 响应时间测试 | 多次输入不同长度的对话内容并回车，记录从发送请求到开始显示返回结果的时间 | 响应时间在可接受范围内（如 2 秒内）|
|2           | 并发性能测试 | 模拟多个用户同时输入对话内容并回车，观察服务器响应情况 | 服务器能正常处理并发请求，无明显卡顿或崩溃 |
|3          | 存储性能测试 | 持续进行对话操作，观察服务器存储空间的使用情况 | 存储空间使用情况符合预期，每日新增对话数据约 1 GB |

### 4.2 测试结果分析

- 响应时间测试：当输入较短对话内容时，响应时间基本在 1 - 2 秒内，但输入较长对话内容时，响应时间会延长到 5 - 10 秒，甚至更长。
- 并发性能测试：当并发用户数达到 20 左右时，服务器开始出现明显的卡顿现象，部分请求响应时间过长，甚至出现请求失败的情况。
- 存储性能测试：在持续进行对话操作的过程中，服务器存储空间的使用情况基本符合预期，但在某些高峰时段，存储空间的增长速度会略有加快。

## 5、可优化点

### 5.1 功能优化

- 优化整体响应式设计，确保项目在 H5 端和小程序端的布局和样式显示正常。
- 修复内联对话模式切换过程中的界面闪烁问题，提升用户体验。
- 解决 PDF 文件上传失败的问题，优化错误提示信息，方便用户排查问题。
- 优化 LLM 接口调用逻辑，避免上传文件后调用接口超时的问题。
- 优化图片加载逻辑，提高图片格式内容的加载速度。
- 修复代码复制不完整的问题，确保用户能正常复制较长代码。

### 5.2 性能优化

- 优化 LLM 接口调用算法，减少输入较长对话内容时的响应时间。
- 对服务器进行性能调优，如增加服务器资源、优化服务器配置等，以提高服务器的并发处理能力。
- 优化数据存储策略，如采用数据压缩、定期清理等方式，确保存储空间的稳定使用。

## 六、总结

通过本次功能测试和性能测试，发现了项目在兼容性、文件上传、接口调用、性能等方面存在的一些问题，并提出了相应的优化建议。在后续的开发过程中，需要针对这些问题进行逐一解决，以提高项目的整体质量和用户体验。

# 五、项目总结与反思

1. ##### 目前仍存在的问题

- 兼容性问题：虽然提到要兼容 H5 和小程序形态，但可能在实际开发中存在适配困难的情况。不同平台的屏幕尺寸、交互方式和性能限制各不相同，可能导致部分功能在某些平台上无法正常显示或使用。
- 文件格式支持不完善：虽然目标是支持文本、图片、PDF 等多种交流的文件格式，但在实际开发中，可能会遇到不同文件格式解析困难的问题。例如，PDF 文件可能存在复杂的排版和加密情况，图片可能有不同的编码格式，这些都需要更完善的处理机制。
- LLM 接口稳定性：依赖于外部的大模型 API，如讯飞星辰 MaaS 平台的 DeepSeek - V3 模型和智谱 AI 开放平台的 GLM - 4V - Plus - 0111 模型，这些 API 可能会受到网络波动、平台维护等因素的影响，导致接口调用失败或响应时间过长。
- 性能问题：随着每日新增对话数据量的增加，可能会对服务器和前端性能产生影响。例如，大量数据的存储和读取可能导致页面加载缓慢，影响用户体验。

1. ##### 已识别出的优化项

- 优化文件处理逻辑：对于不同的文件格式，采用更高效、更通用的解析库，确保文件能够正确解析和处理。例如，使用专业的 PDF 解析库处理 PDF 文件，对图片进行适当的压缩和格式转换，以减少数据传输量。
- 错误处理和重试机制：在调用 LLM 接口时，增加错误处理和重试机制。当接口调用失败时，能够自动重试一定次数，并向用户提供友好的错误提示信息。同时，可以考虑对不同类型的错误进行分类处理，例如网络错误、API 服务不可用等。
- 数据缓存和分页加载：为了提高性能，对一些频繁使用的数据进行缓存，减少不必要的网络请求。对于大量的对话数据，可以采用分页加载的方式，避免一次性加载过多数据导致页面卡顿。
- 优化前端性能：对前端代码进行性能优化，例如压缩代码、减少 DOM 操作、合理使用懒加载等技术，提高页面加载速度和响应性能。

1. ##### 架构演进的可能性

- 微服务架构：随着项目功能的不断扩展和用户量的增加，当前的单体架构可能无法满足需求。可以考虑将项目拆分为多个微服务，例如用户管理服务、对话服务、文件处理服务等，每个微服务独立部署和扩展，提高系统的可维护性和可扩展性。
- 引入消息队列：对于大量的用户请求和异步任务，引入消息队列可以有效地解耦系统组件，提高系统的吞吐量和稳定性。例如，将用户的文件上传请求放入消息队列中，由专门的文件处理服务进行处理，避免阻塞主线程。
- 服务器端渲染（SSR）或静态站点生成（SSG）：为了进一步提高页面的加载速度和 SEO 友好性，可以考虑采用服务器端渲染或静态站点生成技术。对于一些静态内容，可以在构建时生成 HTML 文件，减少客户端的渲染时间。
- 容器化和自动化部署：使用容器化技术（如 Docker）将应用程序及其依赖项打包成容器，方便在不同环境中部署和运行。结合自动化部署工具（如 Kubernetes），实现应用程序的自动化部署、伸缩和管理，提高开发和运维效率。

# 七、后续的新功能 (待办🫓)

- [ ] 后端加入功能: 验证用户登录, 管理密钥, 保存历史聊天记录到后台数据库
- [ ] 用户生态加入新功能: 分享自己觉得很6的AI对话, 前端类似小红书的瀑布信息流, 用户在帖子下可以点赞评论收藏等等