class ConversacionScene extends Phaser.Scene {
    constructor() {
        super('ConversacionScene');
    }

    preload() {
        // Carga de imágenes para el chat
        this.load.image('foto_diego', 'sprites/foto_diego.png');
        this.load.image('foto_keyla', 'sprites/foto_keyla.png');
        this.load.image('foto_aitor', 'sprites/foto_aitor.png');
    }

    create() {
        // Fondo oscuro general
        this.cameras.main.setBackgroundColor('#1a1a1a');

        // Estado
        this.currentState = 'HOME'; // HOME, CHAT_LIST, CHAT_DIEGO, CHAT_KEYLA
        this.messageIndex = 0;
        this.optionsShown = false;
        this.ending = false;

        // Conversaciones
        this.conversationDiego = [
            { sender: 'Diego', text: 'Tu' },
            { sender: 'Diego', text: 'Le gustas a Keyla' },
            { type: 'pause' },
            { sender: 'Aitor', text: 'He leído los mensajes' },
            { sender: 'Aitor', text: 'Cómo que le gusto a Keyla' },
            { sender: 'Diego', text: 'Pues eso' },
            { sender: 'Aitor', text: 'Y cómo lo sabes' },
            { sender: 'Diego', text: 'Me lo ha dicho' },
            { sender: 'Diego', type: 'audio', text: 'Audio - 0:03' },
            { sender: 'Aitor', text: 'Que creo que es mentira' },
            { sender: 'Diego', text: 'Que no' },
            { sender: 'Aitor', text: 'Que no me lo creo' },
            { sender: 'Diego', text: 'Pues créetelo coño' },
            { sender: 'Diego', text: 'Habla con ella, el martes se lo dices.' },
            { sender: 'Diego', text: 'o hoy...' }
        ];

        this.conversationKeyla = [
            { sender: 'Aitor', text: 'Esta mañana he estado hablando con Diego' },
            { sender: 'Keyla', text: '?' },
            { sender: 'Keyla', text: 'si' },
            { sender: 'Keyla', text: 'y?' },
            { sender: 'Aitor', text: 'Me ha estado contando no sé qué' },
            { sender: 'Keyla', text: 'sobre q?' },
            { sender: 'Aitor', text: 'Algo tuyo' },
            { sender: 'Keyla', text: 'mio?' },
            { sender: 'Aitor', text: 'si' },
            { sender: 'Keyla', text: 'AAAAAAA LA MIERDA' },
            { sender: 'Keyla', text: '...' },
            { sender: 'Keyla', text: 'te ha dicho que me gustas no?' },
            { sender: 'Aitor', text: 'No me dijo que eras una fan de bts' },
            { sender: 'Keyla', text: 'Q COJONES JAJAJAJA' },
            { sender: 'Aitor', text: 'Como que te gusto?' },
            { sender: 'Keyla', text: 'ay' },
            { sender: 'Aitor', text: 'La cagaste no?' },
            { sender: 'Keyla', text: 'aver, esto la verdad me gustaría haberlo hablado en persona. Vale, pues si, me gusta mucho estar contigo, me pareces muy interesante y me atraes, pero quería esperar a conocerte más para decírtelo.' },
            { sender: 'Aitor', text: 'El diego me dijo todo esta mañana, solo quería verte sufrir un poquito. Lo siento me caes muy bien pero no quiero nada con nadie.' }
        ];

        // Marco del móvil (centrado)
        const phoneX = 400;
        const phoneY = 200;
        this.phoneWidth = 260;
        this.phoneHeight = 380;

        // Borde del móvil
        this.add.rectangle(phoneX, phoneY, this.phoneWidth + 12, this.phoneHeight + 12, 0x333333, 1).setOrigin(0.5);
        // Pantalla del móvil
        this.screenBg = this.add.rectangle(phoneX, phoneY, this.phoneWidth, this.phoneHeight, 0x000000, 1).setOrigin(0.5);

        // Contenedor para UI para poder limpiar fácilmente el contenido de la pantalla
        this.uiContainer = this.add.container(phoneX - this.phoneWidth / 2, phoneY - this.phoneHeight / 2);

        // Máscara para que el chat no se salga de la pantalla del móvil
        const maskShape = this.make.graphics();
        maskShape.fillStyle(0xffffff);
        maskShape.fillRect(phoneX - this.phoneWidth / 2, phoneY - this.phoneHeight / 2, this.phoneWidth, this.phoneHeight);
        const mask = maskShape.createGeometryMask();
        this.uiContainer.setMask(mask);

        // Elementos visuales instanciados
        this.renderedMessages = [];

        this.showHomeScreen();

        // Control para avanzar
        this.keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        this.input.keyboard.on('keydown-C', () => this.advanceChat());

        // Botón Volver
        const backButton = this.add.text(20, 20, '← Volver', {
            fontFamily: '"Courier New", Courier, monospace',
            fontSize: '24px',
            color: '#ffffff',
            backgroundColor: '#000000',
            padding: { x: 10, y: 5 }
        }).setInteractive({ useHandCursor: true }).setDepth(100);

        backButton.on('pointerover', () => backButton.setStyle({ color: '#ff69b4' }));
        backButton.on('pointerout', () => backButton.setStyle({ color: '#ffffff' }));
        backButton.on('pointerdown', () => this.scene.start('HubScene', { desde: 'nivel2' }));
    }

    clearUI() {
        this.uiContainer.removeAll(true);
        this.renderedMessages = [];
        this.currentY = 20;
        this.optionsShown = false;
        if (this.headerContainer) {
            this.headerContainer.destroy();
            this.headerContainer = null;
        }
    }

    showHomeScreen() {
        this.currentState = 'HOME';
        this.clearUI();
        this.screenBg.fillColor = 0x87CEFA; // Wallpaper azul claro

        // Status bar
        const statusBg = this.add.rectangle(this.phoneWidth / 2, 10, this.phoneWidth, 20, 0x000000, 0.3);
        const timeText = this.add.text(this.phoneWidth / 2, 10, '12:34', { fontSize: '10px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);
        const battText = this.add.text(this.phoneWidth - 20, 10, '🔋 100%', { fontSize: '10px', color: '#fff' }).setOrigin(0.5);
        this.uiContainer.add([statusBg, timeText, battText]);

        // App icons
        const startX = 50;
        const startY = 60;
        const gapX = 80;
        const gapY = 80;

        const apps = [
            { col: 0, row: 0, color: 0xDB4437, label: 'Correo' },
            { col: 1, row: 0, color: 0x4285F4, label: 'Mapas' },
            { col: 2, row: 0, color: 0xF4B400, label: 'Notas' },
            { col: 0, row: 1, color: 0x1DA1F2, label: 'Bird' },
            { col: 1, row: 1, color: 0xE1306C, label: 'Insta' },
            { col: 2, row: 1, color: 0x25D366, label: 'WhatsApp', isWa: true },
            { col: 0, row: 2, color: 0xFF0000, label: 'Tube' },
            { col: 1, row: 2, color: 0x111111, label: 'Reloj' }
        ];

        apps.forEach(app => {
            const x = startX + app.col * gapX;
            const y = startY + app.row * gapY;

            // Icon bg shape
            const iconBg = this.add.rectangle(x, y, 46, 46, app.color, 1).setInteractive({ useHandCursor: app.isWa });

            // Label
            const labelText = this.add.text(x, y + 32, app.label, { fontSize: '11px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);

            let innerText;
            if (app.isWa) {
                innerText = this.add.text(x, y, 'WA', { fontStyle: 'bold', fontSize: '18px', color: '#fff' }).setOrigin(0.5);
                iconBg.on('pointerdown', (p, evX, evY, event) => {
                    event.stopPropagation();
                    this.showChatList();
                });
            } else {
                innerText = this.add.text(x, y, app.label[0], { fontStyle: 'bold', fontSize: '18px', color: '#fff' }).setOrigin(0.5);
            }

            this.uiContainer.add([iconBg, innerText, labelText]);
        });
    }

    showChatList() {
        this.currentState = 'CHAT_LIST';
        this.clearUI();
        this.screenBg.fillColor = 0x111b21; // WhatsApp dark

        // Header
        const header = this.add.rectangle(this.phoneWidth / 2, 20, this.phoneWidth, 40, 0x202c33);
        const headerText = this.add.text(10, 10, 'WhatsApp', { fontSize: '18px', color: '#fff', fontStyle: 'bold' });
        this.uiContainer.add([header, headerText]);

        // Chat Diego
        const chatDiegoBg = this.add.rectangle(this.phoneWidth / 2, 70, this.phoneWidth, 60, 0x111b21).setInteractive({ useHandCursor: true });
        const chatDiegoName = this.add.text(60, 60, 'Diego 🎮', { fontSize: '16px', color: '#fff' });
        const diegoAvatar = this.add.image(30, 70, 'foto_diego').setDisplaySize(40, 40);

        chatDiegoBg.on('pointerdown', (p, x, y, event) => {
            event.stopPropagation();
            this.startChat('DIEGO');
        });

        // Chat Keyla
        const chatKeylaBg = this.add.rectangle(this.phoneWidth / 2, 130, this.phoneWidth, 60, 0x111b21).setInteractive({ useHandCursor: true });
        const chatKeylaName = this.add.text(60, 120, 'Keyla 🎸', { fontSize: '16px', color: '#fff' });
        const keylaAvatar = this.add.image(30, 130, 'foto_keyla').setDisplaySize(40, 40);

        // Opcional: Impedir entrar a Keyla hasta terminar Diego
        // Para respetar la descripción, abriremos el chat de Keyla sólo al final de Diego
        chatKeylaBg.on('pointerdown', (p, x, y, event) => {
            event.stopPropagation();
            // this.startChat('KEYLA'); // Comentado, se abrirá por el flujo de botones
        });

        this.uiContainer.add([chatDiegoBg, chatDiegoName, diegoAvatar, chatKeylaBg, chatKeylaName, keylaAvatar]);
    }

    startChat(person) {
        this.clearUI();
        this.screenBg.fillColor = 0x0b141a; // WhatsApp chat background

        this.currentPerson = person;
        this.currentState = person === 'DIEGO' ? 'CHAT_DIEGO' : 'CHAT_KEYLA';
        this.messageIndex = 0;
        this.currentY = 50;

        // Header Chat
        const phoneX = 400;
        const phoneY = 200;
        if (this.headerContainer) this.headerContainer.destroy();
        this.headerContainer = this.add.container(phoneX - this.phoneWidth / 2, phoneY - this.phoneHeight / 2);

        const header = this.add.rectangle(this.phoneWidth / 2, 20, this.phoneWidth, 40, 0x202c33);
        const headerText = this.add.text(50, 10, person === 'DIEGO' ? 'Diego 🎮' : 'Keyla 🎸', { fontSize: '16px', color: '#fff', fontStyle: 'bold' });
        const backBtn = this.add.text(10, 10, '<', { fontSize: '20px', color: '#fff' }).setInteractive({ useHandCursor: true });

        backBtn.on('pointerdown', (p, x, y, event) => {
            event.stopPropagation();
            this.showChatList();
        });

        this.headerContainer.add([header, headerText, backBtn]);
        this.headerContainer.setDepth(20);

        // Añadir una pequeña instrucción si es el inicio
        if (person === 'DIEGO') {
            const hint = this.add.text(this.phoneWidth / 2, 100, 'Conversación\n(C)', { fontSize: '16px', color: '#aaaaaa', fontStyle: 'bold', align: 'center' }).setOrigin(0.5);
            this.uiContainer.add(hint);
            this.hintText = hint;
        }
    }

    advanceChat() {
        if (this.hintText) {
            this.hintText.destroy();
            this.hintText = null;
        }

        if (this.currentState === 'CHAT_DIEGO') {
            if (this.messageIndex < this.conversationDiego.length) {
                this.renderMessage(this.conversationDiego[this.messageIndex], 'DIEGO');
                this.messageIndex++;
            } else if (!this.optionsShown) {
                this.showOptions();
            }
        } else if (this.currentState === 'CHAT_KEYLA') {
            if (this.messageIndex < this.conversationKeyla.length) {
                this.renderMessage(this.conversationKeyla[this.messageIndex], 'KEYLA');
                this.messageIndex++;
            } else {
                this.endKeylaChat();
            }
        }
    }

    renderMessage(msgData, chatWith) {
        if (msgData.type === 'pause') {
            // Modificar los mensajes de Diego a "mensaje eliminado"
            this.renderedMessages.forEach(item => {
                if (item.isMessageText && item.msgSender === 'Diego') {
                    item.setText('mensaje eliminado');
                    item.setStyle({ fontStyle: 'italic', color: '#b3b3b3' });
                    item.updateText(); // Forzar actualización de tamaño

                    const padding = 10;
                    const newBubbleW = item.width + padding * 2;
                    const newBubbleH = item.height + padding * 2;

                    item.bubbleRef.width = newBubbleW;
                    item.bubbleRef.height = newBubbleH;
                    if (item.bubbleRef.geom) {
                        item.bubbleRef.geom.width = newBubbleW;
                        item.bubbleRef.geom.height = newBubbleH;
                        item.bubbleRef.updateDisplayOrigin();
                        item.bubbleRef.updateData();
                    }

                    item.bubbleRef.x = 45 + newBubbleW / 2;
                    item.x = 45 + padding; // Asegurar posición X correcta
                }
            });
            return;
        }

        const isAitor = msgData.sender === 'Aitor';
        const isLeft = !isAitor;
        const avatarKey = isAitor ? 'foto_aitor' : (msgData.sender === 'Diego' ? 'foto_diego' : 'foto_keyla');

        // Colors
        const bgColor = isLeft ? 0x202c33 : 0x005c4b; // Gris vs Verde

        // Formato para texto
        const maxTextWidth = this.phoneWidth - 90;
        let textConfig = { fontFamily: 'sans-serif', fontSize: '13px', color: '#fff', wordWrap: { width: maxTextWidth, useAdvancedWrap: true } };
        let msgTextContent = msgData.text;

        if (msgData.type === 'audio') {
            msgTextContent = '🎵 ' + msgTextContent;
            this.sound.play('audio_diego')
        }

        const msgText = this.add.text(0, 0, msgTextContent, textConfig);
        const textBounds = msgText.getBounds();

        // Dimensiones burbuja
        const padding = 10;
        const bubbleW = textBounds.width + padding * 2;
        const bubbleH = textBounds.height + padding * 2;

        // Posiciones
        // Aitor a la derecha (espacio del avatar), Diego/Keyla izquierda
        const bubbleX = isLeft ? 45 + bubbleW / 2 : this.phoneWidth - 45 - bubbleW / 2;
        const avatarX = isLeft ? 20 : this.phoneWidth - 20;

        const avatar = this.add.image(avatarX, this.currentY + 16, avatarKey).setDisplaySize(24, 24);
        const bubble = this.add.rectangle(bubbleX, this.currentY + bubbleH / 2, bubbleW, bubbleH, bgColor, 1).setStrokeStyle(1, 0x000000);

        msgText.setPosition(bubbleX - bubbleW / 2 + padding, this.currentY + padding);

        msgText.isMessageText = true;
        msgText.msgSender = msgData.sender;
        msgText.bubbleRef = bubble;

        this.uiContainer.add([avatar, bubble, msgText]);
        this.renderedMessages.push(avatar, bubble, msgText);

        this.currentY += bubbleH + 10;

        // Auto-scroll si nos pasamos del límite inferior
        if (this.currentY > this.phoneHeight - 60) {
            const shift = this.currentY - (this.phoneHeight - 60);
            this.currentY -= shift;

            // Subir todos los mensajes renderizados
            this.renderedMessages.forEach(item => {
                this.tweens.add({
                    targets: item,
                    y: item.y - shift,
                    duration: 150
                });
            });
        }
    }

    showOptions() {
        this.optionsShown = true;
        const optY = this.phoneHeight - 50;

        // Botón Decírselo hoy
        const btnYes = this.add.rectangle(this.phoneWidth / 2, optY - 20, this.phoneWidth - 40, 30, 0x25D366, 0.9).setInteractive({ useHandCursor: true });
        const txtYes = this.add.text(this.phoneWidth / 2, optY - 20, '✅ Decírselo hoy', { fontSize: '14px', color: '#000', fontStyle: 'bold' }).setOrigin(0.5);

        // Botón No
        const btnNo = this.add.rectangle(this.phoneWidth / 2, optY + 20, this.phoneWidth - 40, 30, 0xd32f2f, 0.9).setInteractive({ useHandCursor: true });
        const txtNo = this.add.text(this.phoneWidth / 2, optY + 20, '❌ No', { fontSize: '14px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        btnYes.on('pointerdown', (p, x, y, event) => {
            event.stopPropagation();
            this.startChat('KEYLA'); // Start Keyla Chat
        });

        btnNo.on('pointerdown', (p, x, y, event) => {
            event.stopPropagation();
            this.showRestartVignette();
        });

        this.uiContainer.add([btnYes, txtYes, btnNo, txtNo]);
    }

    showRestartVignette() {
        // Viñeta roja
        const overlay = this.add.rectangle(400, 200, 800, 400, 0x000000, 0.85);
        const text = this.add.text(400, 160, '¿No recuerdas cómo pasó? 😏', { fontSize: '28px', color: '#ff4444', fontStyle: 'bold', stroke: '#000', strokeThickness: 4 }).setOrigin(0.5);

        const btnRestart = this.add.rectangle(400, 260, 180, 50, 0xff0000).setInteractive({ useHandCursor: true });
        const txtRestart = this.add.text(400, 260, 'REINICIAR', { fontSize: '22px', color: '#fff', fontStyle: 'bold' }).setOrigin(0.5);

        btnRestart.on('pointerdown', () => {
            this.scene.restart();
        });
    }

    endKeylaChat() {
        if (this.ending) return;
        this.ending = true;
        this.cameras.main.fade(3000, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('CelosScene');
        });
    }
}
