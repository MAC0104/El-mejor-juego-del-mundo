class HubScene extends Phaser.Scene {
    constructor() {
        super('HubScene');
    }

    init(data) {
        this.fromData = data || {};
        // Acumulamos progreso: una vez abierto, siempre abierto
        this.nivel2Abierto = this.fromData.nivel2Abierto || false;
        this.nivel3Abierto = this.fromData.nivel3Abierto || false;
        this.nivel3Completado = this.fromData.nivel3Completado || false;
    }

    create() {
        this.cameras.main.setBackgroundColor('#555555');
        this.physics.world.setBounds(0, 0, 2400, 400);
        this.cameras.main.setBounds(0, 0, 2400, 400);

        const ground = this.physics.add.image(1200, 370, '__DEFAULT');
        ground.setDisplaySize(2400, 60);
        ground.setImmovable(true);
        ground.body.allowGravity = false;
        ground.setVisible(false);
        this.add.rectangle(1200, 370, 2400, 60, 0x333333);

        const ceiling = this.physics.add.image(1200, 10, '__DEFAULT');
        ceiling.setDisplaySize(2400, 40);
        ceiling.setImmovable(true);
        ceiling.body.allowGravity = false;
        ceiling.setVisible(false);
        this.add.rectangle(1200, 10, 2400, 40, 0x555555);

        const doorSpacing = 2400 / 7;
        for (let i = 0; i < 6; i++) {
            const x = doorSpacing * (i + 1);
            const y = 260;

            this.add.text(x, y - 50, `Nivel ${i + 1}`, {
                fontFamily: '"Courier New", Courier, monospace', fontSize: '16px', color: '#ffffff', fontStyle: 'bold'
            }).setOrigin(0.5);

            if (i === 0) {
                // Nivel 1: siempre abierto
                this.add.image(x, y, 'puerta').setDisplaySize(100, 160);
                this.door1X = x;
                this.door1Y = y;
            } else if (i === 1) {
                // Nivel 2: abierto solo si nivel2Abierto
                if (this.nivel2Abierto) {
                    this.add.image(x, y, 'puerta').setDisplaySize(100, 160);
                } else {
                    this.add.image(x, y, 'puerta_cerrada').setDisplaySize(100, 160);
                }
                this.door2X = x;
                this.door2Y = y;
            } else if (i === 2) {
                // Nivel 3: abierto solo si nivel3Abierto
                if (this.nivel3Abierto) {
                    this.add.image(x, y, 'puerta').setDisplaySize(100, 160);
                } else {
                    this.add.image(x, y, 'puerta_cerrada').setDisplaySize(100, 160);
                }
                this.door3X = x;
                this.door3Y = y;
            } else {
                this.add.image(x, y, 'puerta_cerrada').setDisplaySize(100, 160);
            }
        }

        // Pared y puerta secreta (solo si nivel 3 completado)
        this.paredActiva = false;
        if (this.nivel3Completado) {
            const paredX = this.door3X + 200;

            this.paredFisica = this.add.rectangle(paredX, 200, 20, 400, 0x000000, 0);
            this.physics.add.existing(this.paredFisica, true);

            this.add.rectangle(paredX, 200, 80, 400, 0x797470).setDepth(2);
            this.add.rectangle(paredX, 260, 80, 140, 0x5b1f00).setDepth(3);
            this.add.rectangle(paredX, 260, 68, 128, 0x9a5833).setDepth(4);
            this.add.circle(paredX + 28, 260, 5, 0xffffff).setDepth(5);

            this.puertaSecretaX = paredX;
            this.puertaSecretaY = 260;
            this.paredActiva = true;
            this.intentosFallidos = 0;
            this.acertijoAbierto = false;
        }

        this.interactText = this.add.text(0, 0, 'Entrar\n(E)', {
            fontFamily: '"Courier New", Courier, monospace', fontSize: '16px', color: '#ffffff', fontStyle: 'bold', align: 'center', padding: { x: 5, y: 5 }
        }).setOrigin(0.5).setDepth(10).setVisible(false);

        this.cerradaText = this.add.text(0, 0, '🔒', {
            fontSize: '24px'
        }).setOrigin(0.5).setDepth(10).setVisible(false);

        let spawnX = 100;
        if (this.fromData.desde === 'nivel1') spawnX = this.door1X + 120;
        if (this.fromData.desde === 'nivel2') spawnX = this.door2X + 120;
        if (this.fromData.desde === 'nivel3') spawnX = this.door3X + 120;

        this.player = this.physics.add.sprite(spawnX, 200, 'aitor_idle');
        this.player.setDisplaySize(120, 120);
        this.player.body.setSize(24, 34);
        this.player.body.setOffset(12, 14);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);

        if (!this.anims.exists('idle')) {
            this.anims.create({
                key: 'idle', frames: this.anims.generateFrameNumbers('aitor_idle', { start: 0, end: 3 }), frameRate: 3, repeat: -1
            });
        }
        if (!this.anims.exists('walk_right')) {
            this.anims.create({
                key: 'walk_right', frames: this.anims.generateFrameNumbers('aitor_walk_right', { start: 0, end: 3 }), frameRate: 4, repeat: -1
            });
        }
        if (!this.anims.exists('walk_left')) {
            this.anims.create({
                key: 'walk_left', frames: this.anims.generateFrameNumbers('aitor_walk_left', { start: 0, end: 3 }), frameRate: 4, repeat: -1
            });
        }

        this.physics.add.collider(this.player, ground);
        this.physics.add.collider(this.player, ceiling);
        if (this.paredActiva) {
            this.physics.add.collider(this.player, this.paredFisica);
        }

        this.cameras.main.startFollow(this.player, true, 0.05, 0.05);
        this.cursors = this.input.keyboard.createCursorKeys();
        this.keyE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
        this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);

        const backButton = this.add.text(20, 20, '← Volver', {
            fontFamily: '"Courier New", Courier, monospace', fontSize: '24px', color: '#ffffff', backgroundColor: '#000000', padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setInteractive({ useHandCursor: true });
        backButton.on('pointerdown', () => this.scene.start('MenuScene'));
    }

    mostrarAcertijo() {
        if (this.acertijoAbierto) return;
        this.acertijoAbierto = true;
        this.player.body.setVelocityX(0);

        const overlay = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.97).setScrollFactor(0).setDepth(50);
        const titulo = this.add.text(400, 80, 'Tienes el derecho de contestar esto:', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '28px', color: '#00ff00', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
        const codigo = this.add.text(400, 200, '¿AZC BFO RLD ELCÑLÑZ ELXEZ OX ÑODNSPCLC ODEZ?\n ALCA ALDLC L VL DSQFSOXEO PLDO ÑSWO...\n DS 1000 + 1000 = 1000,\n ¿NFLXEZ OD 1000 + 1111?', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '20px', color: '#00ff00', align: 'center',
            wordWrap: { width: 700 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(51);
        const cerrar = this.add.text(400, 340, '[ cerrar ]', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '18px', color: '#aaaaaa'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(51).setInteractive({ useHandCursor: true });

        cerrar.on('pointerover', () => cerrar.setStyle({ color: '#ffffff' }));
        cerrar.on('pointerout', () => cerrar.setStyle({ color: '#aaaaaa' }));
        cerrar.on('pointerdown', () => {
            overlay.destroy();
            titulo.destroy();
            codigo.destroy();
            cerrar.destroy();
            this.acertijoAbierto = false;
            this.intentosFallidos++;
            if (this.intentosFallidos === 1) {
                this.mostrarNaTeRindas();
            }
        });
    }

    mostrarNaTeRindas() {
        this.add.text(this.puertaSecretaX - 170, this.puertaSecretaY - 120, 'Na te rindas', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '30px', color: '#000000', fontStyle: 'italic bold'
        }).setOrigin(0.5).setDepth(60);
    }

    update() {
        const speed = 300;
        if (this.cursors.left.isDown) {
            this.player.body.setVelocityX(-speed);
            this.player.anims.play('walk_left', true);
        } else if (this.cursors.right.isDown) {
            this.player.body.setVelocityX(speed);
            this.player.anims.play('walk_right', true);
        } else {
            this.player.body.setVelocityX(0);
            this.player.anims.play('idle', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-800);
        }

        let onDoor = false;

        // Nivel 1: siempre abierto
        if (Math.abs(this.player.x - this.door1X) < 80) {
            this.interactText.setVisible(true).setPosition(this.door1X, this.door1Y - 90).setText('Entrar\n(E)');
            this.cerradaText.setVisible(false);
            onDoor = true;
            if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.scene.start('GameScene');
        }

        // Nivel 2: abierto o cerrado
        if (this.door2X && Math.abs(this.player.x - this.door2X) < 80) {
            onDoor = true;
            if (this.nivel2Abierto) {
                this.interactText.setVisible(true).setPosition(this.door2X, this.door2Y - 90).setText('Entrar\n(E)');
                this.cerradaText.setVisible(false);
                if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.scene.start('ConversacionScene', { nivel2Abierto: this.nivel2Abierto, nivel3Abierto: this.nivel3Abierto, nivel3Completado: this.nivel3Completado });
            } else {
                this.interactText.setVisible(false);
            }
        }

        // Nivel 3: abierto o cerrado
        if (this.door3X && Math.abs(this.player.x - this.door3X) < 80) {
            onDoor = true;
            if (this.nivel3Abierto) {
                this.interactText.setVisible(true).setPosition(this.door3X, this.door3Y - 90).setText('Entrar\n(E)');
                this.cerradaText.setVisible(false);
                if (Phaser.Input.Keyboard.JustDown(this.keyE)) this.scene.start('SilencioScene', { nivel2Abierto: this.nivel2Abierto, nivel3Abierto: this.nivel3Abierto, nivel3Completado: this.nivel3Completado });
            } else {
                this.interactText.setVisible(false);
            }
        }

        // Puerta secreta
        if (this.paredActiva && Math.abs(this.player.x - this.puertaSecretaX) < 80) {
            this.interactText.setVisible(true).setPosition(this.puertaSecretaX, this.puertaSecretaY - 90).setText('Abrir\n(A)');
            this.cerradaText.setVisible(false);
            onDoor = true;
            if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
                this.mostrarAcertijo();
            }
        }

        if (!onDoor) {
            this.interactText.setVisible(false);
            this.cerradaText.setVisible(false);
        }
    }
}