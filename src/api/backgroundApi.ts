/**
 * 获取当前选项卡的 URL
 * @returns 当前选项卡的 URL
 */
export async function getCurrentTabUrl(): Promise<{ title: string | undefined, url: string | undefined }> {
  const { sendMessage } = await import('webext-bridge/content-script')
  return await sendMessage('get-active-tab', {}).then((res) => {
    return res
  })
}
