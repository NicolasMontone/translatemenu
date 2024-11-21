if (!process.env.WEBHOOK_HOST) {
  throw new Error('WEBHOOK_HOST is not set')
}

export const imageWebhookUrl = (id: string) =>
  `${process.env.WEBHOOK_HOST}/api/save-image/${id}`
