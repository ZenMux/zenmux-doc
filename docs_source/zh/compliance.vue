<template>
  <div class="compliance-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1>安全合规</h1>
      <p>ZenMux 致力于在全球监管框架下支持客户的安全与合规需求。我们提供强有力的数据保护控制措施，旨在帮助组织满足包括 GDPR 在内的主要隐私法律以及其他地区性标准的要求。ZenMux 还提供全面的数据处理附录（DPA），清晰阐明我们的安全实践、数据处理义务与客户权利，确保信息披露充分透明，并与当前主流合规要求保持一致。</p>
      <div class="compliance-line"></div>
    </div>

    <!-- 卡片列表 -->
    <div class="card-list">
      <div v-for="(card, index) in cardList" :key="index" class="card-item">
        <img :src="card.img" :alt="card.alt" />
        <span class="card-tag">{{ card.status }}</span>
      </div>
    </div>

    <!-- 控制措施列表 -->
    <div class="controls-list">
      <div
        v-for="(control, index) in controlsList"
        :key="index"
        class="control-item"
      >
        {{ control }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const cardList = [
  {
    img: "https://cdn.marmot-cloud.com/storage/zenmux/2025/12/29/XeFOBdl/AICPA-SOC-2.svg",
    status: "In progress",
    alt:'SOC2 Type1',
  },
  {
    img: "https://cdn.marmot-cloud.com/storage/zenmux/2025/12/29/4PHBRxb/GDPR.svg",
    status: "In progress",
    alt:'GDPR',
  },
  {
    img: "https://cdn.marmot-cloud.com/storage/zenmux/2025/12/29/p2o1ZKt/ISO-27001.svg",
    status: "In progress",
    alt:'ISO27001',
  },
];

const controlsList: string[] = [
  "CC1.1.2 已与第三方或分包商建立包含条款、条件和职责的合同协议。",
  "CC1.2.1 公司的董事会拥有足够数量且与管理层分离并保持独立的成员，并能提供客观的评估与决策。",
  "CC1.3.1 公司在业务规划过程中评估其组织结构、汇报关系、权限与职责，按需更新并向员工传达。",
  "CC1.4.1 技能要求在岗位说明书中形成文档，并在招聘与绩效评审过程中评估候选人满足这些要求的能力。",
  "CC1.5.1 公司管理者对员工完成绩效评审，以确保岗位职责与控制责任得到履行。",
  "CC2.1.1 已配置日志记录与监控软件，以从系统基础设施组件与端点系统收集数据，用于监控系统性能、潜在安全漏洞、资源利用率，并在检测到异常系统活动或服务请求时向实体团队发出告警。",
  "CC2.2.2 公司要求员工/承包商每年完成一次安全意识培训。",
  "CC3.2.2 维护系统资产清单，涵盖物理设备与系统、虚拟设备、软件、数据与数据流、外部信息系统以及组织角色。",
  "CC4.2.2 计划中的变更与更新作为开发路线图的一部分进行沟通。",
  "CC6.1.2 范围内系统与应用程序已配置为使用唯一用户账号对用户进行身份验证，并强制执行最低密码要求或 SSH 公钥认证。",
  "CC6.2.1 新入职人员或现有用户访问级别变更基于岗位职责，并在实施前由管理层提出申请、记录并授权。",
  "CC6.2.2 离职用户的访问权限由 IT 应人力资源（HR）请求予以禁用。所有访问变更（包括终止）均在服务台（Help Desk）工单系统中记录并跟踪。",
  "CC6.3.1 用户访问角色与权限每年由管理层审查，并予以批准或更新。",
  "CC6.7.1 使用 VPN、TLS、SFTP 等加密技术在传输过程中保护通信与数据。",
  "CC6.8.1 公司使用反恶意软件（anti-malware）软件，进行集中管理并部署到客户端机器上，同时监控未经授权或恶意软件的安装。",
  "CC7.1.1 公司执行网络漏洞扫描，包括内部与外部扫描；扫描每月进行一次，并在重大升级后执行。",
  "CC7.2.1 已建立变更检测机制，用于向人员告警对关键系统文件、配置文件及内容文件的未授权修改。",
  "CC7.3.1 IT 运维人员审查已识别的安全事件以确定影响，并在必要时建议补救措施。",
  "CC8.1.1 变更请求通过变更请求表（Change Request form）提交，并录入工单系统以便跟踪。每个变更工单均获得管理层批准并记录。",
  "CC8.1.2 平台应用的开发与测试在与生产环境分离的环境中进行。",
];
</script>

<style scoped>
.compliance-line {
  border-top: 1px solid #e2e2e3;
  height:1px;
  width:100%;
  padding-top: 80px;
  margin-top: 48px;
}
.card-list {
  display: flex;
  justify-content: space-between;
  padding:0 120px 80px 120px;
}
.card-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.card-tag {
  border: 1px solid #e6e6e6;
  font-size: 12px;
  line-height: 12px;
  color: #666666;
  padding: 3px 6px;
  background-color: #fafafa;
  border-radius: 4px;
}

.controls-list {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-top: 32px;
  border-top: 1px solid #eee;
}
.control-item {
  border-bottom: 1px solid #eee;
  color: #333;
  padding-bottom: 32px;
}
</style>
