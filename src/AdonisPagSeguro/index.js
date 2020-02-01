const { Card, PaymentMethods, RecurringPayment, Session } = require('@vwp/pagseguro-node');

/**
 * @template T
 * @typedef {( T | null)} Maybe
 */

/**
 * adonis-pagseguro is a provider that implements pagseguro-node, a pagseguro SDK
 *
 * @constructor
 * @singleton
 * @uses (['Adonis/Src/Config'])
 *
 * @class PagSeguro
 */
class PagSeguro {
	constructor({ Config }) {
		this.Config = Config;
		this.email = this.Config.get('pagseguro.email');
		this.token = this.Config.get('pagseguro.token');
		this.session = null;
	}

	/**
	 * @returns {Promise<string>}
	 */
	async getSession() {
		if (!this.session) {
			this.session = await Session.getSession(this.email, this.token);
		}

		return this.session;
	}

	/**
	 * @param {string} cardInformation.amount
	 * @param {string} cardInformation.cardBrand
	 * @param {string} cardInformation.cardCvv
	 * @param {string} cardInformation.cardExpirationMonth
	 * @param {string} cardInformation.cardExpirationYear
	 * @param {string} cardInformation.cardNumber
	 * @returns {Promise<Maybe<string>>}
	 */
	async getCardToken(cardInformation) {
		return Card.getCardToken(await this.getSession(), cardInformation);
	}

	/**
	 *
	 * @param {string} cardNumber
	 * @returns {Promise<Maybe<string>>}
	 */
	async getCardFlag(cardNumber) {
		return Card.getCardFlag(await this.getSession(), cardNumber);
	}

	/**
	 *
	 * @param {number} amount
	 * @returns {Promise<Object>}
	 */
	async getPaymentMethods(amount) {
		return PaymentMethods.getPaymentMethods(amount, await this.getSession());
	}

	/**
	 *
	 * @param planInformation
	 * @returns {Promise<Maybe<{code: string, date: string}>>}
	 */
	async createPlan(planInformation) {
		return RecurringPayment.createPlan(planInformation, this.email, this.token);
	}

	/**
	 *
	 * @param planReference
	 * @param amountPerPayment
	 * @param updateSubscriptions
	 * @returns {Promise<boolean>}
	 */
	async editPlanPrice(planReference, amountPerPayment, updateSubscriptions = false) {
		return RecurringPayment.editPlanPrice(
			planReference,
			{
				amountPerPayment,
				updateSubscriptions,
			},
			this.email,
			this.token,
		);
	}

	/**
	 *
	 * @param user
	 * @returns {Promise<Maybe<string>>}
	 */
	async joinPlan(user) {
		return RecurringPayment.joinPlan(user, this.email, this.token);
	}

	/**
	 *
	 * @param payment
	 * @returns {Promise<Maybe<{date: Maybe<string>, transactionCode: Maybe<string> }>>}
	 */
	async chargePlan(payment) {
		return RecurringPayment.chargePlan(payment, this.email, this.token);
	}

	/**
	 *
	 * @param preApprovalCode
	 * @param planReference
	 * @param payment
	 * @returns {Promise<string>}
	 */
	async retryPlanPayment(preApprovalCode, planReference, payment) {
		return RecurringPayment.retryPlanPayment(preApprovalCode, planReference, payment, this.email, this.token);
	}

	/**
	 *
	 * @param preApprovalReference
	 * @param newStatus
	 * @returns {Promise<boolean>}
	 */
	async editSubscriptionStatus(preApprovalReference, newStatus) {
		return RecurringPayment.editSubscriptionStatus(preApprovalReference, newStatus, this.email, this.token);
	}

	/**
	 *
	 * @param preApprovalReference
	 * @returns {Promise<boolean>}
	 */
	async cancelSubscription(preApprovalReference) {
		return RecurringPayment.cancelSubscription(preApprovalReference, this.email, this.token);
	}
}

module.exports = PagSeguro;
