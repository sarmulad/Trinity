
import { TAGO_CONFIG } from './constants'
import type { TagoDevice, TagoVariable, TagoQuery } from '@/types'

/**
 * Fetch data from Tago.io device
 * @param deviceId - The device ID
 * @param query - Query parameters
 */
export async function fetchTagoData(
  deviceId: string,
  query?: TagoQuery
): Promise<TagoVariable[]> {
  if (!TAGO_CONFIG.TOKEN) {
    console.warn('Tago.io token not configured')
    return []
  }

  try {
    const url = new URL(`${TAGO_CONFIG.API_URL}/data`)
    if (query?.qty) url.searchParams.append('qty', query.qty.toString())
    if (query?.start_date) url.searchParams.append('start_date', query.start_date)
    if (query?.end_date) url.searchParams.append('end_date', query.end_date)

    const response = await fetch(url.toString(), {
      headers: {
        'Device-Token': TAGO_CONFIG.DEVICE_TOKEN || '',
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Tago.io API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Error fetching Tago.io data:', error)
    return []
  }
}

/**
 * Send data to Tago.io device
 * @param data - Array of variables to send
 */
export async function sendTagoData(data: Omit<TagoVariable, 'time'>[]): Promise<boolean> {
  if (!TAGO_CONFIG.DEVICE_TOKEN) {
    console.warn('Tago.io device token not configured')
    return false
  }

  try {
    const response = await fetch(`${TAGO_CONFIG.API_URL}/data`, {
      method: 'POST',
      headers: {
        'Device-Token': TAGO_CONFIG.DEVICE_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })

    return response.ok
  } catch (error) {
    console.error('Error sending data to Tago.io:', error)
    return false
  }
}

/**
 * Fetch device list from Tago.io
 */
export async function fetchTagoDevices(): Promise<TagoDevice[]> {
  if (!TAGO_CONFIG.TOKEN) {
    console.warn('Tago.io token not configured')
    return []
  }

  try {
    const response = await fetch(`${TAGO_CONFIG.API_URL}/device`, {
      headers: {
        Authorization: `Bearer ${TAGO_CONFIG.TOKEN}`,
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`Tago.io API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.result || []
  } catch (error) {
    console.error('Error fetching Tago.io devices:', error)
    return []
  }
}

/**
 * Subscribe to real-time updates via WebSocket (placeholder)
 * 
 * Implementation guide:
 * 1. Use Tago.io's MQTT or WebSocket connection
 * 2. Subscribe to device topics
 * 3. Handle incoming messages
 * 4. Update UI state
 */
export function subscribeToRealtimeUpdates(
  deviceId: string,
  onUpdate: (data: TagoVariable[]) => void
): () => void {
  // TODO: Implement WebSocket connection to Tago.io
  // This is a placeholder for real-time subscription

  console.log(`Subscribing to real-time updates for device: ${deviceId}`)

  // Return unsubscribe function
  return () => {
    console.log(`Unsubscribing from device: ${deviceId}`)
  }
}
