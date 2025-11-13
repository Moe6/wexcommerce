import { Schema, model } from 'mongoose'
import * as lebobeautycoTypes from ':lebobeautyco-types'
import * as env from '../config/env.config'

export const ORDER_EXPIRE_AT_INDEX_NAME = 'expireAt'

const orderSchema = new Schema<env.Order>({
  user: {
    type: Schema.Types.ObjectId,
    required: [true, "can't be blank"],
    ref: 'User',
  },
  deliveryType: {
    type: Schema.Types.ObjectId,
    required: [true, "can't be blank"],
    ref: 'DeliveryType',
  },
  paymentType: {
    type: Schema.Types.ObjectId,
    required: [true, "can't be blank"],
    ref: 'PaymentType',
  },
  total: {
    type: Number,
    required: [true, "can't be blank"],
  },
  status: {
    type: String,
    enum: [
      lebobeautycoTypes.OrderStatus.Pending,
      lebobeautycoTypes.OrderStatus.Paid,
      lebobeautycoTypes.OrderStatus.Confirmed,
      lebobeautycoTypes.OrderStatus.InProgress,
      lebobeautycoTypes.OrderStatus.Cancelled,
      lebobeautycoTypes.OrderStatus.Shipped,
    ],
    required: [true, "can't be blank"],
  },
  orderItems: {
    type: [Schema.Types.ObjectId],
    ref: 'OrderItem',
  },
  sessionId: {
    type: String,
    index: true,
  },
  paymentIntentId: {
    type: String,
  },
  customerId: {
    type: String,
  },
  paypalOrderId: {
    type: String,
  },
  expireAt: {
    //
    // Orders created from checkout with Stripe are temporary and
    // are automatically deleted if the payment checkout session expires.
    //
    type: Date,
    index: { name: ORDER_EXPIRE_AT_INDEX_NAME, expireAfterSeconds: env.ORDER_EXPIRE_AT, background: true },
  },
}, {
  timestamps: true,
  strict: true,
  collection: 'Order',
})

// Add custom indexes
orderSchema.index({ 'user._id': 1 })
orderSchema.index({ 'paymentType.name': 1, 'deliveryType.name': 1 })
orderSchema.index({ status: 1 })
orderSchema.index({ createdAt: -1 })
orderSchema.index({ orderItems: 1 })
orderSchema.index(
  { 'orderItems.product.name': 'text' },
  {
    default_language: 'none', // This disables stemming
    language_override: '_none', // Prevent MongoDB from expecting a language field
    background: true,
  },
)

const Order = model<env.Order>('Order', orderSchema)

export default Order
