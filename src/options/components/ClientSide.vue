<script setup lang="ts">
import { ref } from 'vue'
import { Message } from '@arco-design/web-vue'
import { IconDelete, IconRobot } from '@arco-design/web-vue/es/icon'
import { healthCheck } from '../api/client'
import { type Client, addClient, deleteClient, getClient, getClientList, setDefaultClient } from '~/api/fetchApi'

const deviceList = ref<Client[]>([])
const defaultDeviceId = ref()

const deviceName = ref('')
const deviceAddress = ref('')
const deviceKey = ref('')

async function testDevice() {
  if (!deviceName.value || !deviceAddress.value || !deviceKey.value) {
    Message.error('请填写完整的设备信息')
    return
  }
  const result = await healthCheck(deviceAddress.value)
  if (result) {
    Message.success('连接成功')
    return true
  }
  else {
    Message.error('连接失败,请检查设备信息')
    return false
  }
}

async function addDevice() {
  if (!await testDevice()) {
    Message.error('添加失败')
    return
  }

  if (deviceList.value.some(device => device.name === deviceName.value)) {
    Message.error('设备名称已存在')
    return
  }
  const deviceToDelete = getClient(deviceAddress.value)
  if (deviceToDelete) {
    Message.error('请勿重复添加设备')
    return
  }

  const hasPreferred = deviceList.value.length === 0

  addClient(
    deviceName.value,
    deviceAddress.value,
    deviceKey.value,
    true,
    hasPreferred,
  )

  init()

  deviceName.value = ''
  deviceAddress.value = ''
  deviceKey.value = ''
  Message.success('设备添加成功')
}

function setDefaultDevice(deviceId: string) {
  if (defaultDeviceId.value === deviceId) {
    Message.error('已经是默认设备')
    return
  }
  setDefaultClient(deviceId)
  init()
  Message.success('默认设备设置成功')
}

function deleteDevice(deviceId: string) {
  const deviceToDelete = getClient(deviceId)
  if (deviceToDelete?.preferred) {
    Message.error('不能删除默认设备')
    return
  }
  deleteClient(deviceId)
  init()
  Message.success('设备删除成功')
}

function init() {
  deviceList.value = getClientList()
  const defaultDevice = deviceList.value.find(device => device.preferred)
  if (defaultDevice) {
    defaultDeviceId.value = defaultDevice.url
  }
  deviceList.value.forEach(async (device) => {
    device.status = await healthCheck(device.url)
  })
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="client-side">
    <!-- 添加设备表单 -->
    <div class="add-device-form">
      <h2>添加设备</h2>
      <a-form
        :model="{ deviceName, deviceAddress, deviceKey }"
        layout="vertical"
      >
        <a-form-item field="deviceName" label="设备名称">
          <a-input v-model="deviceName" placeholder="请输入设备名称" />
        </a-form-item>
        <a-form-item field="deviceAddress" label="访问地址">
          <a-input v-model="deviceAddress" placeholder="请输入访问地址" />
        </a-form-item>
        <a-form-item field="deviceKey" label="设备密钥">
          <a-input-password v-model="deviceKey" placeholder="请输入设备密钥" />
        </a-form-item>
        <a-space>
          <a-button status="success" @click="testDevice">
            测试连接
          </a-button>
          <a-button type="primary" @click="addDevice">
            添加设备
          </a-button>
        </a-space>
      </a-form>
    </div>

    <!-- 设备列表 -->
    <div class="device-list">
      <h2>设备列表</h2>
      <div class="device-grid">
        <div v-for="device in deviceList" :key="device.id" class="device-card">
          <div class="device-tag">
            <a-tag :color="device.status ? 'green' : 'red'">
              {{ device.status ? "在线" : "离线" }}
            </a-tag>
            <a-tag v-show="device.preferred" :color="device.status ? 'arcoblue' : 'gray'">
              {{ device.preferred ? "默认设备" : "" }}
            </a-tag>
            <div class="device-tag-hover">
              <a-tag
                v-if="!device.preferred"
                :color="device.status ? 'arcoblue' : 'gray'"
                @click="setDefaultDevice(device.url)"
              >
                设为默认
              </a-tag>
              <a-tag color="red" @click="deleteDevice(device.url)">
                <template #icon>
                  <IconDelete />
                </template>
                删除
              </a-tag>
            </div>
          </div>
          <div class="device-content">
            <div class="device-logo">
              <IconRobot />
            </div>
            <div class="device-info">
              <h3 class="text-ellipsis">
                {{ device.name }}
              </h3>
              <p class="text-ellipsis">
                地址：{{ device.url }}
              </p>
              <p class="text-ellipsis">
                密钥：{{ device.secret }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.client-side {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.add-device-form {
  margin-bottom: 48px;
  max-width: 600px;
  background: var(--color-bg-2);
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.add-device-form h2 {
  margin-bottom: 24px;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 500;
}

.device-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
}

.device-card {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  background: var(--color-bg-2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
}

.device-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.device-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.device-status.available {
  background-color: var(--color-success-light);
  color: var(--color-success);
}

.device-status.error {
  background-color: var(--color-danger-light);
  color: var(--color-danger);
}

.delete-button {
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  padding: 6px 12px;
  color: var(--color-danger);
  background-color: var(--color-danger-light);
  border-radius: 4px;
  transition: all 0.2s ease;
}

.device-status:hover .delete-button {
  display: block;
}

.delete-button:hover {
  background-color: var(--color-danger);
  color: white;
}

.device-content {
  display: flex;
  gap: 24px;
  align-items: center;
}

.device-logo {
  font-size: 48px;
  color: var(--color-text-2);
  transition: color 0.3s ease;
}

.device-card:hover .device-logo {
  color: var(--color-primary);
}

.device-info {
  flex: 1;
}

.device-info h3 {
  margin: 0 0 12px;
  color: var(--color-text-1);
  font-size: 16px;
  font-weight: 500;
}

.device-info p {
  margin: 8px 0;
  color: var(--color-text-3);
  font-size: 14px;
}

.device-list h2 {
  margin-bottom: 24px;
  color: var(--color-text-1);
  font-size: 20px;
  font-weight: 500;
}

.device-tag {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.device-tag-hover {
  display: none;
  flex-direction: column;
  gap: 8px;
}

.device-card:hover .device-tag-hover {
  display: flex;
}

.device-info {
  flex: 1;
  min-width: 0; /* 确保flex子项可以正确收缩 */
}

.device-info h3,
.device-info p {
  margin: 8px 0;
  padding-right: 100px; /* 为右侧标签留出空间 */
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
