<template>
  <div class="compliance-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <h1 class="compliance-title">Security and Compliance</h1>
      <p>ZenMux is committed to supporting our customers’ security and compliance needs across global regulatory frameworks. We provide robust data-protection controls designed to help organizations meet requirements under major privacy laws, including the GDPR, and other regional standards. ZenMux also offers a comprehensive Data Processing Addendum (DPA) that clearly outlines our security practices, data-handling obligations, and customer rights, ensuring full transparency and alignment with modern compliance expectations.</p>
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
  "CC1.1.2 Contractual agreements with terms, conditions and responsibilities are established with third parties or subcontractors.",
  "CC1.2.1 The Company's board has sufficient members separate and independent from management and provide objective evaluation and decision-making.",
  "CC1.3.1 The Company evaluates its organizational structure, reporting lines, authorities, and responsibilities as part of its business planning process, updates as needed and communicates to employees.",
  "CC1.4.1 Skill requirements are documented in position descriptions, and candidates' abilities to meet these requirements are evaluated as part of the hiring and performance review processes.",
  "CC1.5.1 The Company managers complete performance reviews for employees to ensure job roles and control responsibilities are performed.",
  "CC2.1.1 Logging and monitoring software is configured to collect data from system infrastructure components and endpoint systems to monitor system performance, potential security vulnerabilities, resource utilization and alert the Entity team upon detection of unusual system activity or service requests.",
  "CC2.2.2 The Company requires employees/contractors to complete the Security Awareness training on an annual basis.",
  "CC3.2.2 A systems inventory is maintained that includes physical devices and systems, virtual devices, software, data and data flows, external information systems, and organizational roles.",
  "CC4.2.2 Planned changes and updates are communicated as part of the development roadmap.",
  "CC6.1.2 The in-scope systems and application are configured to authenticate users with a unique user account and enforce minimum password requirements or SSH public key authentication.",
  "CC6.2.1 New hire or existing user access level changes are based on job responsibility and are requested, documented and authorized by management prior to implementation.",
  "CC6.2.2 Terminated user access rights are disabled by IT at the request of HR. All access changes, including terminations, are documented and tracked in the Help Desk ticket system.",
  "CC6.3.1 User access roles and privileges are reviewed and approved or updated by management on an annual basis.",
  "CC6.7.1 Encryption technologies such as VPN, TLS, SFTP and are used to protect communications and data during transmission.",
  "CC6.8.1 The Company utilizes anti-malware software which is centrally managed and deployed on client machines and is monitored for unauthorized or malicious software installations.",
  "CC7.1.1 The Company performs network vulnerability scans, internal and external; scans are performed monthly and after major upgrades.",
  "CC7.2.1 A change detection mechanism is in place to alert personnel to unauthorized modifications of critical system files, configuration files, and content files.",
  "CC7.3.1 IT Operations personnel review identified security events to determine impact and to recommend remediation, if necessary.",
  "CC8.1.1 Change requests are submitted via a Change Request form and are entered into a ticket system for tracking. Management approval is obtained and documented in each change ticket.",
  "CC8.1.2 The Platform application development and testing are done in separate environments from production.",
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
