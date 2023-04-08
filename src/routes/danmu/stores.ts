import { KeepLiveWS } from 'bilibili-live-ws'
import { intros } from 'svelte/internal'
import { derived, readable, type Readable } from 'svelte/store'

interface Emot {
	emoji: string
	/** img */
	url: string
	width: number
	height: number
}

interface DanmuMsgExta {
	emots: { [k: string]: Emot }
}

type NumberBool = 0 | 1

/**表情包 */
interface BigEmot {
	bulge_display: NumberBool
	emoticon_unique: string
	in_player_area: NumberBool
	is_dynamic: NumberBool
	/** img */
	url: string
	height: number
	width: number
}

interface DanmuMsg {
	cmd: 'DANMU_MSG'
	info: {
		0: {
			/** 是否是大表情 */
			13: '{}' | BigEmot
			/** extra: json string */
			15: {
				extra: string
			}
		}
		/**弹幕消息 */
		1: string
		/** uid & nickname */
		2: {
			/** uid */
			0: number
			/** nickname */
			1: string
		}
		9: {
			ts: number
			/** color */
			ct: string
		}
	}
}

interface GiftMsg {
	cmd: 'SEND_GIFT'
	data: {
		batch_combo_id: string
		face: string
		uid: number
		uname: string
		giftName: string
		giftId: number
		timestamp: number
		price: number
		num: number
		total_coin: number
		combo_total_coin: number
		super_gift_num: number
		blind_gift: null | {
			original_gift_price: number
			original_gift_id: number
			original_gift_name: string
		}
	}
}

interface UserInfo {
	face: string
	face_frame: string
	uname: string
}

interface SuperChatMsg {
	cmd: 'SUPER_CHAT_MESSAGE'
	data: {
		background_bottom_color: string
		background_color: string
		background_color_end: string
		background_color_start: string
		background_price_color: string
		end_time: number
		ts: number
		message: string
		message_font_color: string
		trans_mark: NumberBool
		user_info: UserInfo
		price: number
		time: number
		uid: number
	}
}

export function Live(roomid: any) {
	return readable<KeepLiveWS | null>(null, (set) => {
		roomid = parseInt(roomid)
		const live = new KeepLiveWS(roomid)
		// live.once('close', () => {
		// 	set(null)
		// })
		set(live)
		return () => {
			live.close()
		}
	})
}

export interface BaseItem {
	type: string
	nickname: string
	uid: number
}

export interface DanmuItem extends BaseItem {
	type: 'danmu'
	msg: string
	// ts: number
}
export interface SuperChatItem extends BaseItem {
	type: 'sc'
	price: number
	/** second */
	time: number
	face: string
	msg: string
}

export interface Gift {
	id: number
	name: string
	/**定价 */
	price: number
	/**数量 */
	num: number
	/**总价 */
	value: number
}

export interface GiftItem extends BaseItem {
	type: 'gift'
	batch_combo_id: string
	gift: Gift
	box: null | Gift
	face: string
}

type Item = DanmuItem | SuperChatItem | GiftItem

export function Danmu(live: Readable<KeepLiveWS | null>) {
	return derived<[typeof live], Item[]>([live], ([live], set) => {
		let danmu: Item[] = []
		if (live == null) {
			set([])
			return
		}
		set(danmu)
		let handleMsg = (data: any) => {
			switch (data.cmd) {
				case 'GUARD_BUY': {
					console.log(data)
					break
				}
				case 'SEND_GIFT': {
					// case 'COMBO_SEND': {
					// console.log(data)
					const gift = toGift(data)
					let combo_gift: GiftItem | null = null
					for (let i = danmu.length - 1; i >= 0; i--) {
						let v = danmu[i]
						if (v.type !== 'gift') {
							continue
						}
						if (v.batch_combo_id === gift.batch_combo_id) {
							combo_gift = v
							break
						}
					}
					if (combo_gift) {
						Object.assign(combo_gift, gift)
					} else {
						danmu.push(gift)
					}
					break
				}
				case 'SUPER_CHAT_MESSAGE':
				case 'SUPER_CHAT_MESSAGE_JPN': {
					// console.log(data)
					const sc = toSC(data)
					danmu.push(sc)
					break
				}
				case 'DANMU_MSG': {
					// console.log(data)
					const d = toDanmu(data)
					danmu.push(d)
					break
				}
				default:
					return
			}
			danmu = danmu.slice(0, 1_000)
			set(danmu)
			return
		}
		live.on('msg', handleMsg)
		return () => {
			live.off('msg', handleMsg)
		}
	})
}

function toDanmu({ info }: DanmuMsg): DanmuItem {
	let msg = info[1]
	if (typeof info[0][13] === 'object') {
		let meta = info[0][13]
		msg = `<img class="bulge-${meta.bulge_display}" src="${meta.url}" alt="${meta.emoticon_unique}" title="${meta.emoticon_unique}" width="${meta.width}" height="${meta.height}" referrerpolicy="no-referrer">`
	} else {
		let extra: DanmuMsgExta = JSON.parse(info[0][15].extra)
		if (extra.emots) {
			for (let id in extra.emots) {
				let meta = extra.emots[id]
				let img = `<img src="${meta.url}" alt="${meta.emoji}" title="${meta.emoji}" width="${meta.width}" height="${meta.height}" referrerpolicy="no-referrer">`
				msg = msg.replaceAll(id, img)
			}
		}
	}
	return {
		type: 'danmu',
		nickname: info[2][1],
		uid: info[2][0],
		msg: msg,
	}
}

function toSC({ data }: SuperChatMsg): SuperChatItem {
	return {
		type: 'sc',
		msg: data.message,
		price: data.price,
		time: data.time,
		uid: data.uid,
		nickname: data.user_info.uname,
		face: data.user_info.face,
		// uid: data.user_info.
	}
}

function toGift({ data }: GiftMsg): GiftItem {
	let box: null | Gift = null
	if (data.blind_gift) {
		let { blind_gift: gift } = data
		box = {
			id: gift.original_gift_id,
			name: gift.original_gift_name,
			price: gift.original_gift_price,
			value: gift.original_gift_price,
			num: 1,
		}
	}
	return {
		type: 'gift',
		batch_combo_id: data.batch_combo_id,
		uid: data.uid,
		nickname: data.uname,
		face: data.face,
		gift: {
			id: data.giftId,
			name: data.giftName,
			price: data.price,
			num: data.super_gift_num,
			value: data.combo_total_coin,
		},
		box: box,
	}
}

// function toGift({ data }:)
