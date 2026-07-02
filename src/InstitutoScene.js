class InstitutoScene extends Phaser.Scene {
    constructor() {
        super('InstitutoScene');
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        this.add.text(400, 200, 'Entrada del Instituto', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '32px',
            color: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(400, 250, 'Pulsa E para avanzar al pasillo', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '18px',
            color: '#aaaaaa'
        }).setOrigin(0.5);

        const backButton = this.add.text(400, 330, '← Volver', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setOrigin(0.5).setInteractive({ useHandCursor: true }).setDepth(100);

        backButton.on('pointerover', () => backButton.setStyle({ color: '#ff69b4' }));
        backButton.on('pointerout', () => backButton.setStyle({ color: '#ffffff' }));
        backButton.on('pointerdown', () => this.scene.start('HubScene'));

        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
            this.scene.start('PasilloScene');
        }
    }
}
