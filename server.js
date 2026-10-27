const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

let globalTreasury = {
    ownerBalanceSyrian: 0,       
    perpetualPoolSyrian: 50000   
};

app.get('/', (req, res) => {
    res.json({ message: "سيرفر غولدن ثري يعمل بنجاح ومستعد لاستقبال تداولات شام كاش!" });
});

app.post('/api/open-vault', (req, res) => {
    const { playerId, vaultType, entryFee } = req.body;

    if (!vaultType || !entryFee) {
        return res.status(400).json({ error: "بيانات الطلب غير مكتملة" });
    }

    const ownerShare = entryFee * 0.60;
    const poolShare = entryFee * 0.40;

    globalTreasury.ownerBalanceSyrian += ownerShare;
    globalTreasury.perpetualPoolSyrian += poolShare;

    const vaultSettings = {
        bronze: { winRate: 70, maxPrize: 1500, gift: "ماء سحري للشجرة 🌳" },
        silver: { winRate: 35, maxPrize: 7000, gift: "عملات رقمية افتراضية 🪙" },
        golden: { winRate: 10, maxPrize: 50000, gift: "ذهب خالص محول لشام كاش 🥇" }
    };

    const config = vaultSettings[vaultType] || vaultSettings.bronze;

    const randomByte = crypto.randomBytes(1);
    const luckScore = (randomByte[0] % 100) + 1; 

    let won = false;
    let prizeAmount = 0;
    let statusMessage = "اقتربت جداً من الفوز! حصلت على ترقية مجانية للشجرة 💧";

    if (luckScore <= config.winRate && globalTreasury.perpetualPoolSyrian >= config.maxPrize) {
        won = true;
        prizeAmount = Math.floor(Math.random() * (config.maxPrize - 500 + 1)) + 500;
        globalTreasury.perpetualPoolSyrian -= prizeAmount; 
        statusMessage = `تهانينا! لقد فتحت الخزنة بنجاح وحصلت على ${config.gift}`;
    }

    res.json({
        success: true,
        playerId: playerId,
        vaultOpened: vaultType,
        won: won,
        status: statusMessage,
        prizeCashSyrian: prizeAmount,
        debug: {
            currentPool: globalTreasury.perpetualPoolSyrian,
            ownerProfitTotal: globalTreasury.ownerBalanceSyrian
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`السيرفر يعمل على المنفذ ${PORT}`);
});
