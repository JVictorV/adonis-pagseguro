const { ServiceProvider } = require('@adonisjs/fold');

class PagSeguroProvider extends ServiceProvider {
	register() {
		this.app.singleton('PagSeguro', () => {
			const Config = this.app.use('Adonis/Src/Config');
			return new (require('../src/PagSeguro'))({ Config });
		});
	}
}

module.exports = PagSeguroProvider;
