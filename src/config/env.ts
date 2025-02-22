import dotenv from 'dotenv';
import { cleanEnv, str, num, url } from 'envalid';
import path from 'path';

// .env ファイルを読み込む
dotenv.config({ path: path.resolve(__dirname, '../../.env') });


// 環境変数のバリデーションと型付け
const env = cleanEnv(process.env, {
    PORT: num({ default: 3000 }),
    NODE_ENV: str({ choices: ['development', 'production', 'test'], default: 'development' }),

    SWAGGER_TITLE: str({ default: 'My API' }),
    SWAGGER_VERSION: str({ default: '1.0.0' }),
    SWAGGER_DESCRIPTION: str({ default: 'A simple Express API' }),
    SERVER_URL: url({ default: 'http://localhost:3000' }),
    API_PREFIX: str(),

    DB_HOST: str(),
    DB_PORT: num(),
    DB_USER: str(),
    DB_PASS: str(),
    DB_NAME: str(),
});

export default env;