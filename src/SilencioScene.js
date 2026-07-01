class SilencioScene extends Phaser.Scene {
    constructor() {
        super('SilencioScene');
    }

    preload() {
        this.load.spritesheet('keyla_idle', 'sprites/keyla_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('keyla_walk_right', 'sprites/keyla_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('keyla_walk_left', 'sprites/keyla_walk_left.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_idle', 'sprites/aitor_idle.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_walk_right', 'sprites/aitor_walk_right.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('aitor_walk_left', 'sprites/aitor_walk_left.png', { frameWidth: 48, frameHeight: 48 });
    }

    create() {
        this.cameras.main.setBackgroundColor('#87ceeb');
        this.physics.world.setBounds(0, 0, 2400, 400);
        this.cameras.main.setBounds(0, 0, 2400, 400);

        this.ground = this.physics.add.image(1200, 385, '__DEFAULT');
        this.ground.setDisplaySize(2400, 30);
        this.ground.setImmovable(true);
        this.ground.body.allowGravity = false;
        this.ground.setVisible(false);
        this.add.rectangle(1200, 385, 2400, 30, 0x228b22).setDepth(0);

        this.plataformas = this.physics.add.staticGroup();
        const plataformasData = [
            { x: 300, y: 280 }, { x: 550, y: 220 }, { x: 800, y: 300 },
            { x: 1050, y: 240 }, { x: 1300, y: 280 }, { x: 1550, y: 220 },
            { x: 1800, y: 260 }, { x: 2050, y: 300 }
        ];
        plataformasData.forEach(p => {
            const plat = this.add.rectangle(p.x, p.y, 120, 16, 0x333333).setDepth(2);
            this.physics.add.existing(plat, true);
            this.plataformas.add(plat);
        });

        this.recuerdos = [];
        const recuerdosPos = [
            { x: 300, y: 230 }, { x: 800, y: 250 },
            { x: 1300, y: 230 }, { x: 1800, y: 210 }
        ];
        recuerdosPos.forEach((pos, i) => {
            const hoja = this.add.rectangle(pos.x, pos.y, 30, 30, 0xffffff).setDepth(3);
            this.physics.add.existing(hoja, true);
            this.tweens.add({
                targets: hoja, y: pos.y - 15, duration: 1000,
                yoyo: true, repeat: -1, ease: 'Sine.easeInOut', delay: i * 250
            });
            this.recuerdos.push(hoja);
        });

        this.keyla = this.physics.add.sprite(2300, 200, 'keyla_idle');
        this.keyla.setDisplaySize(120, 120);
        this.keyla.body.allowGravity = true;
        this.keyla.setDepth(3);
        if (!this.anims.exists('keyla_idle_silencio')) {
            this.anims.create({
                key: 'keyla_idle_silencio',
                frames: this.anims.generateFrameNumbers('keyla_idle', { start: 0, end: 3 }),
                frameRate: 3, repeat: -1
            });
        }
        this.keyla.play('keyla_idle_silencio');

        this.player = this.physics.add.sprite(50, 200, 'aitor_idle');
        this.player.setDisplaySize(120, 120);
        this.player.body.setSize(24, 34);
        this.player.body.setOffset(12, 14);
        this.player.body.setBounce(0.1);
        this.player.body.setCollideWorldBounds(true);
        this.player.setDepth(4);

        if (!this.anims.exists('aitor_idle_anim')) {
            this.anims.create({ key: 'aitor_idle_anim', frames: this.anims.generateFrameNumbers('aitor_idle', { start: 0, end: 3 }), frameRate: 3, repeat: -1 });
        }
        if (!this.anims.exists('aitor_walk_right_anim')) {
            this.anims.create({ key: 'aitor_walk_right_anim', frames: this.anims.generateFrameNumbers('aitor_walk_right', { start: 0, end: 3 }), frameRate: 4, repeat: -1 });
        }
        if (!this.anims.exists('aitor_walk_left_anim')) {
            this.anims.create({ key: 'aitor_walk_left_anim', frames: this.anims.generateFrameNumbers('aitor_walk_left', { start: 0, end: 3 }), frameRate: 4, repeat: -1 });
        }

        this.physics.add.collider(this.player, this.ground);
        this.physics.add.collider(this.player, this.plataformas);
        this.physics.add.collider(this.keyla, this.ground);

        this.aura = { radius: 80 };
        this.auraRadio = 80;
        this.oscuridad = this.add.graphics().setDepth(6).setScrollFactor(0);

        this.fraseInicial = this.add.text(400, 80, '"Recuerdas cuando...?"', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '22px', color: '#ffffff', fontStyle: 'italic', alpha: 0
        }).setOrigin(0.5).setScrollFactor(0).setDepth(10);
        this.tweens.add({ targets: this.fraseInicial, alpha: 1, duration: 2000, yoyo: true, hold: 2000 });

        this.recuerdosRecogidos = 0;
        this.faseIluminada = false;
        this.bloqueado = false;
        this.trivialActivo = false;

        this.datosRecuerdos = [
            {
                foto: null,
                descripcion: 'En la excursión al Urban Planet...',
                pregunta: '¿Quién hizo un comentario a Keyla y a Aitor sobre que parecían pareja?',
                opciones: ['Gorka', 'Juanfe', 'Hugo Calvo'],
                correcta: 0
            },
            {
                foto: null,
                descripcion: 'Cuando Keyla empezó 4º de la ESO...',
                pregunta: '¿Para espantar a quién te pidió ayuda?',
                opciones: ['Al cubano', 'Al peruano', 'Al Ricote'],
                correcta: 1
            },
            {
                foto: null,
                descripcion: 'Cuando Keyla y Atiro empezaron a hablar antes de ser novios...',
                pregunta: '¿Quien le dijo "Te quiero" al otro primero?',
                opciones: ['Ninguno, eran muy bobitos', 'Aitor a Keyla a mediados de octubre', 'Keyla a Aitor a mediados de diciembre'],
                correcta: 2
            },
            {
                foto: null,
                descripcion: 'En la primera quedada de Aitor y Keyla...',
                pregunta: '¿Qué sintió Aitor?',
                opciones: ['"Me estoy enamorando"', '"Fuck"', 'Todas las anteriores de forma lineal'],
                correcta: 2
            }
        ];

        this.cameras.main.startFollow(this.player, true, 1, 1);
        this.cursors = this.input.keyboard.createCursorKeys();

        const backButton = this.add.text(20, 20, '← Volver', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '24px', color: '#ffffff', backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setScrollFactor(0).setInteractive({ useHandCursor: true }).setDepth(100);
        backButton.on('pointerdown', () => this.scene.start('HubScene', { nivel3Completado: true, desde: 'nivel3' }));
    }

    dibujarOscuridad() {
        this.oscuridad.clear();
        const cx = this.player.x - this.cameras.main.scrollX;
        const cy = this.player.y - this.cameras.main.scrollY;
        const r = this.aura.radius;
        this.oscuridad.fillStyle(0x000000, 1);
        this.oscuridad.fillRect(0, 0, 800, cy - r);
        this.oscuridad.fillRect(0, cy + r, 800, 400);
        this.oscuridad.fillRect(0, cy - r, cx - r, r * 2);
        this.oscuridad.fillRect(cx + r, cy - r, 800 - (cx + r), r * 2);
    }

    mostrarTrivial(indice) {
        this.trivialActivo = true;
        this.bloqueado = true;
        const datos = this.datosRecuerdos[indice];
        this.player.body.setVelocityX(0);
        this.player.body.setVelocityY(0);

        const overlay = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.85).setScrollFactor(0).setDepth(20);
        const caja = this.add.rectangle(400, 200, 680, 340, 0xffffff).setScrollFactor(0).setDepth(21);
        caja.setStrokeStyle(2, 0xffffff);

        let fotoObj;
        let fotoPlaceholder = null;
        if (datos.foto) {
            fotoObj = this.add.image(160, 170, datos.foto).setDisplaySize(200, 150).setScrollFactor(0).setDepth(22);
        } else {
            fotoObj = this.add.rectangle(170, 140, 200, 170, 0x333333).setScrollFactor(0).setDepth(22);
            fotoPlaceholder = this.add.text(170, 140, '📷 Foto', { fontSize: '16px', color: '#aaaaaa' }).setOrigin(0.5).setScrollFactor(0).setDepth(23);
        }

        const desc = this.add.text(400, 105, datos.descripcion, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '13px', color: '#000000',
            wordWrap: { width: 280 }, align: 'left'
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(22);

        const preg = this.add.text(400, 150, datos.pregunta, {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '14px', color: '#000000', fontStyle: 'bold',
            wordWrap: { width: 280 }, align: 'left'
        }).setOrigin(0, 0).setScrollFactor(0).setDepth(22);

        const botonesObj = [];
        datos.opciones.forEach((opc, i) => {
            const btnY = 255 + i * 35;
            const btn = this.add.rectangle(400, btnY, 580, 28, 0xdddddd).setScrollFactor(0).setDepth(22).setInteractive({ useHandCursor: true });
            btn.setStrokeStyle(1, 0x999999);
            const txt = this.add.text(400, btnY, opc, {
                fontFamily: '"Courier New", Courier, monospace',
                fontSize: '13px', color: '#000000'
            }).setOrigin(0.5).setScrollFactor(0).setDepth(23);
            botonesObj.push(btn, txt);
            btn.on('pointerover', () => btn.setFillStyle(0xbbbbbb));
            btn.on('pointerout', () => btn.setFillStyle(0xdddddd));
            btn.on('pointerdown', () => {
                [overlay, caja, fotoObj, desc, preg, ...botonesObj].forEach(o => o.destroy());
                if (fotoPlaceholder) fotoPlaceholder.destroy();

                if (i === datos.correcta) {
                    this.recuerdosRecogidos++;
                    const bien = this.add.text(400, 180, '✅ ¡Correcto!', {
                        fontFamily: '"Courier New", Courier, monospace',
                        fontSize: '28px', color: '#00ff00', fontStyle: 'bold'
                    }).setOrigin(0.5).setScrollFactor(0).setDepth(25);

                    this.time.delayedCall(1200, () => {
                        bien.destroy();
                        const nuevoRadio = this.auraRadio + 40;
                        this.tweens.add({
                            targets: this.aura,
                            radius: nuevoRadio,
                            duration: 800,
                            ease: 'Sine.easeOut',
                            onComplete: () => {
                                this.auraRadio = nuevoRadio;
                                this.trivialActivo = false;
                                this.player.body.setVelocityX(0);
                                this.player.body.setVelocityY(0);
                                this.player.anims.play('aitor_idle_anim', true);
                                this.cursors.left.reset();
                                this.cursors.right.reset();
                                this.cursors.up.reset();
                                this.bloqueado = false;
                                if (this.recuerdosRecogidos >= 4) {
                                    this.iniciarFaseIluminada();

                                };
                            }
                        });
                    });
                } else {
                    this.trivialActivo = false;
                    this.oscuridad.setVisible(true);
                    this.bloqueado = false;
                    this.mostrarReintentar();
                }
            });
        });
    }

    iniciarFaseIluminada() {
        this.faseIluminada = true;
        this.tweens.add({
            targets: this.aura,
            radius: 1200,
            duration: 2000,
            ease: 'Quad.easeOut',
            onComplete: () => {
                this.oscuridad.clear();
                this.plataformas.getChildren().forEach(p => p.setFillStyle(0x888888));
                this.keyla.setVisible(true);
            }
        });
    }

    mostrarReintentar() {
        const overlay = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.85).setScrollFactor(0).setDepth(30);
        const txt = this.add.text(400, 170, '¡Incorrecto!\nInténtalo de nuevo', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '26px', color: '#ff4444', fontStyle: 'bold', align: 'center'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(31);
        const btn = this.add.rectangle(400, 260, 200, 50, 0xffd700).setScrollFactor(0).setDepth(31).setInteractive({ useHandCursor: true });
        this.add.text(400, 260, 'REINTENTAR', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '22px', color: '#000000', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(32);
        btn.on('pointerdown', () => this.scene.restart());
    }

    mostrarVinyetaFinal() {
        this.bloqueado = true;
        this.player.body.setVelocityX(0);
        this.player.body.setVelocityY(0);

        const keylaScreenX = this.keyla.x - this.cameras.main.scrollX;
        const keylaScreenY = this.keyla.y - this.cameras.main.scrollY;

        const caja = this.add.rectangle(keylaScreenX, keylaScreenY - 80, 220, 50, 0xffffff).setScrollFactor(0).setDepth(41);
        caja.setStrokeStyle(2, 0x000000);
        const texto = this.add.text(keylaScreenX, keylaScreenY - 80, 'Cuánto tiempo, ¿qué tal todo? :)', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '13px', color: '#000000', align: 'center', wordWrap: { width: 200 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(42);

        this.time.delayedCall(3000, () => {
            caja.destroy();
            texto.destroy();
            this.mostrarPiezaPuzzle();
        });
    }

    mostrarPiezaPuzzle() {
        this.add.rectangle(400, 200, 800, 400, 0x000000, 0.7).setScrollFactor(0).setDepth(50);
        const box = this.add.rectangle(400, 200, 500, 250, 0xffffff).setScrollFactor(0).setDepth(51);
        box.setStrokeStyle(4, 0x000000);
        this.add.text(400, 140, '¡Has conseguido la tercera pieza del puzzle!', {
            fontSize: '20px', color: '#000000', fontStyle: 'bold', align: 'center', wordWrap: { width: 450 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(52);
        this.add.text(400, 200, 'Amor 30%', {
            fontSize: '32px', color: '#ff69b4', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(52);
        const btnOk = this.add.rectangle(400, 270, 160, 45, 0xffd700).setScrollFactor(0).setDepth(52).setInteractive({ useHandCursor: true });
        btnOk.setStrokeStyle(2, 0x000000);
        this.add.text(400, 270, 'ACEPTAR', {
            fontSize: '22px', color: '#000000', fontStyle: 'bold'
        }).setOrigin(0.5).setScrollFactor(0).setDepth(53);
        btnOk.on('pointerdown', () => this.scene.start('HubScene', { nivel3Completado: true, desde: 'nivel3' }));
    }

    update() {
        if (!this.faseIluminada) {
            this.dibujarOscuridad();
        }
        if (this.bloqueado) return;

        const speed = 300;
        if (this.cursors.left.isDown && !this.bloqueado) {
            this.player.body.setVelocityX(-speed);
            this.player.anims.play('aitor_walk_left_anim', true);
        } else if (this.cursors.right.isDown && !this.bloqueado) {
            this.player.body.setVelocityX(speed);
            this.player.anims.play('aitor_walk_right_anim', true);
        } else {
            this.player.body.setVelocityX(0);
            this.player.anims.play('aitor_idle_anim', true);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.body.setVelocityY(-800);
        }


        if (!this.trivialActivo && !this.faseIluminada) {
            this.recuerdos.forEach((hoja, i) => {
                if (hoja.active && Phaser.Math.Distance.Between(
                    this.player.x, this.player.y, hoja.x, hoja.y) < 35) {
                    hoja.destroy();
                    this.mostrarTrivial(i);
                }
            });
        }

        if (this.faseIluminada && this.keyla && this.keyla.active && !this.bloqueado) {
            if (Phaser.Math.Distance.Between(
                this.player.x, this.player.y, this.keyla.x, this.keyla.y) < 80) {
                this.player.body.setVelocityX(0);
                this.player.body.setVelocityY(0);
                this.player.anims.play('aitor_idle_anim', true);
                this.mostrarVinyetaFinal();
            }
        }
    }
}