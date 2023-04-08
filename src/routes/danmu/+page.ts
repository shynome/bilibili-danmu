import { redirect, type Load } from '@sveltejs/kit'

export const ssr = false

const giftsApi = '/bilibili-live-api/xlive/web-room/v1/giftPanel/giftConfig?platform=pc&source=live'

/**
 * 不清楚的字段都用 deprecated 隐藏掉了
 */
export type Gift = {
	/**31217 */
	id: number
	/**星愿水晶球 */
	name: string
	/**100000 人民币价值 100 */
	price: number
	/**@deprecated */
	type: number
	coin_type: 'gold' | 'silver'
	/**背包礼物 */
	bag_gift: 1 | 0
	/**@deprecated */
	effect: number
	/**
	 * @deprecated
	 * 角标. 白银->爆奖
	 * */
	corner_mark: string
	/**@deprecated */
	corner_background: string
	/**@deprecated */
	broadcast: 0
	/**@deprecated */
	draw: 0
	/**@deprecated */
	stay_time: 3
	/**@deprecated */
	animation_frame_num: 36
	/**like: 被施加了神奇魔法的水晶球 */
	desc: string
	/**通过红包玩法获得 */
	rule: string
	/**额外活动加成 */
	rights: string
	privilege_required: 0
	/**用这个字段就行. "https://s1.hdslb.com/bfs/live/791f28a0913833d23eab68205c0b8d2c66b29b2d.png" */
	img_basic: string
	/**
	 * @deprecated
	 * "https://i0.hdslb.com/bfs/live/791f28a0913833d23eab68205c0b8d2c66b29b2d.png"
	 */
	img_dynamic: string
	/**
	 * @deprecated
	 * "https://i0.hdslb.com/bfs/live/469541dc40b9c0daad32886a5554ae3c77b5e71a.png"
	 */
	frame_animation: string
	/**
	 * @deprecated
	 * "https://i0.hdslb.com/bfs/live/694fda21124dcac7052e62c721e9a2cf5899749c.gif"
	 */
	gif: string
	/**
	 * 动图
	 * "https://i0.hdslb.com/bfs/live/0f8dd4dda2d0ff22bca99a4a2cef7ede37902bf2.webp"
	 */
	webp: string
}

// copy from https://github.com/Nemo2011/bilibili_api/blob/main/bilibili_api/data/api
export interface Resp<T> {
	code: number
	message: string
	ttl: number
	data: T
}

export type GiftsMap = { [k: number]: Gift }

export const load: Load = async ({ url }) => {
	let roomid = url.searchParams.get('roomid')
	if (!roomid) {
		throw redirect(302, '/')
	}
	let giftsLink = new URL(giftsApi, url)
	giftsLink.searchParams.set('room_id', roomid)
	return {
		gifts: fetch(giftsLink, { referrerPolicy: 'no-referrer' })
			.then((r) => r.json())
			.then((r: Resp<{ list: Gift[] }>) => r.data.list)
			.then((gifts) => {
				return gifts.reduce((t, v) => {
					t[v.id] = v
					return t
				}, {} as { [k: string]: Gift })
			}),
	}
}
