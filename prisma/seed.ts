import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with high-precision coordinates...');

    await prisma.email.deleteMany({});

    // テストデータの追加
    await prisma.email.createMany({
        data: [
            {
                from: 'fukushosaigai@m119.city.fukuoka.lg.jp',
                subject: 'ふくしょうめーる',
                body: '中央区　大手門２丁目２番付近に火災のため、消防隊が出動しています。',
                disasterType: '火災',
                address: '博多区那珂３丁目１７番',
                receivedAt: new Date(),
            },
            {
                from: 'fukushosaigai@m119.city.fukuoka.lg.jp',
                subject: 'ふくしょうめーる',
                body: '博多区　那珂３丁目１７番付近に救急のため、消防隊が出動しています',
                disasterType: '救急',
                address: '博多区那珂３丁目１７番',
                receivedAt: new Date(),
            },
            {
                from: 'fukushosaigai@m119.city.fukuoka.lg.jp',
                subject: 'ふくしょうめーる',
                body: '博多区　中洲４丁目７番付近に警戒のため、消防隊が出動しています。',
                disasterType: '警戒',
                address: '博多区中洲４丁目７番',
                receivedAt: new Date(),
            }
        ],
    });

    console.log('✅ Seeding completed with high-precision coordinates.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });