import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Seeding database with high-precision coordinates...');

    // データセット（緯度経度をセット化）
    const hazardData = [
        {
            type: 'Tsunami',
            zone: 'Tsunami1',
            risk: '40',
            area: 'Coastal Area',
            latitude: 33.588293,
            longitude: 130.650871,
        },
        {
            type: 'Tsunami',
            zone: 'Tsunami2',
            risk: '40',
            area: 'Inland Area',
            latitude: 33.592103,
            longitude: 130.657823,
        },
        {
            type: 'Landslide',
            zone: 'Landslide1',
            risk: 'High',
            area: 'Near River',
            latitude: 33.588293,
            longitude: 130.650871,
        },
        {
            type: 'Landslide',
            zone: 'Landslide2',
            risk: 'Low',
            area: 'Hilly Area',
            latitude: 33.592103,
            longitude: 130.657823,
        },
        {
            type: 'Flood',
            zone: 'FloodA',
            risk: 'High',
            level: 100,
            latitude: 33.588293,
            longitude: 130.650871,
        },
        {
            type: 'Flood',
            zone: 'FloodB',
            risk: 'Medium',
            level: 80,
            latitude: 33.592103,
            longitude: 130.657823,
        },
    ];

    // データ挿入
    for (const data of hazardData) {
        const point = `POINT(${data.longitude} ${data.latitude})`;

        if (data.type === 'Tsunami') {
            await prisma.$executeRaw`
                INSERT INTO tsunami_hazard_zones (a40_001, a40_002, a40_003, geom)
                VALUES (${data.zone}, ${data.risk}, ${data.area}, ST_GeomFromText(${point}, 4326));
            `;
        } else if (data.type === 'Landslide') {
            await prisma.$executeRaw`
                INSERT INTO landslide_zones (a33_001, a33_002, a33_003, geometry)
                VALUES (${data.zone}, ${data.risk}, ${data.area}, ST_GeomFromText(${point}, 4326));
            `;
        } else if (data.type === 'Flood') {
            await prisma.$executeRaw`
                INSERT INTO flood_hazard_zones (hazard_type, a31_101, a31_102, a31_103, geometry)
                VALUES (1, ${data.zone}, ${data.risk}, ${data.level}, ST_GeomFromText(${point}, 4326));
            `;
        }
    }

    console.log('✅ Seeding completed with high-precision coordinates.');
}

main()
    .catch((e) => {
        console.error('❌ Seeding failed:', e);

    })
    .finally(async () => {
        await prisma.$disconnect();
    });