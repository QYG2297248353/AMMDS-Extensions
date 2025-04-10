/**
 * 获取当前选项卡的 URL
 * @returns 当前选项卡的 URL
 */
export async function updateCurrentTabUrl() {
  const { sendMessage } = await import('webext-bridge/content-script')
  await sendMessage('update-current-tab', {})
}
