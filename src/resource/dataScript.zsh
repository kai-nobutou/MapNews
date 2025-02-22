#!/bin/bash

# 設定
DB_NAME="disaster_data"          # データベース名
DB_USER="root"          # PostgreSQL ユーザー名
DB_HOST="localhost"              # PostgreSQL ホスト
DB_PORT="5432"                   # PostgreSQL ポート
TARGET_DIR=""   # GeoJSON ファイルがあるディレクトリ
TABLE_NAME=""          # インポートするテーブル名
SRID="4326"                      # 空間参照 ID (WGS84: 4326)
TRUNCATE_TABLE=false             # true にすると既存データを削除

# 確認メッセージ
echo "PostgreSQL データベース '${DB_NAME}' に GeoJSON をインポートします。"
echo "ターゲットテーブル: ${TABLE_NAME}"
echo "ディレクトリ: ${TARGET_DIR}"

# 既存データの削除（オプション）
if [ "$TRUNCATE_TABLE" = true ]; then
    echo "テーブル '${TABLE_NAME}' のデータを削除します..."
    PGPASSWORD="your_password" psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -p "$DB_PORT" -c "TRUNCATE TABLE ${TABLE_NAME};"
fi

# GeoJSON ファイルを検索してインポート
for FILE in "$TARGET_DIR"/*.geojson; do
    if [ -f "$FILE" ]; then
        echo "インポート中: $FILE"
        ogr2ogr \
            -f "PostgreSQL" \
            PG:"dbname=$DB_NAME user=$DB_USER host=$DB_HOST port=$DB_PORT" \
            "$FILE" \
            -nln "$TABLE_NAME" \
            -append \
            -lco GEOMETRY_NAME=geometry \
            -lco FID=id \
            -lco PRECISION=NO \
            -t_srs "EPSG:$SRID"
        
        if [ $? -eq 0 ]; then
            echo "成功: $FILE"
        else
            echo "エラー: $FILE"
        fi
    fi
done

echo "全てのファイルのインポートが完了しました。"



# #flooding_hazard用のスクリプト
# #!/bin/bash

# # 設定
# DB_NAME="disaster_data"           # データベース名
# DB_USER="root"                    # PostgreSQL ユーザー名
# DB_HOST="localhost"                # PostgreSQL ホスト
# DB_PORT="5432"                     # PostgreSQL ポート
# BASE_DIR="/Users/nobutokai/Documents/projects/Hakson/backend/src/resource/flood_hazard"  # ベースディレクトリ
# TABLE_NAME="flood_hazard_zones"    # インポートするテーブル名
# SRID="4326"                        # 空間参照 ID (WGS84: 4326)
# TRUNCATE_TABLE=false               # true にすると既存データを削除

# # 環境変数で PostgreSQL パスワードを設定（事前に export PGPASSWORD=your_password を実行する）
# export PGPASSWORD

# # 確認メッセージ
# echo "PostgreSQL データベース '${DB_NAME}' に GeoJSON をインポートします。"
# echo "ターゲットテーブル: ${TABLE_NAME}"
# echo "ベースディレクトリ: ${BASE_DIR}"

# # 既存データの削除（オプション）
# if [ "$TRUNCATE_TABLE" = true ]; then
#     echo "テーブル '${TABLE_NAME}' のデータを削除します..."
#     psql -U "$DB_USER" -d "$DB_NAME" -h "$DB_HOST" -p "$DB_PORT" -c "TRUNCATE TABLE ${TABLE_NAME};"
# fi

# # 各カテゴリ（_01, _02, _03）をループ処理
# for DIR in "$BASE_DIR"/*; do
#     if [ -d "$DIR" ]; then
#         # hazard_type をディレクトリ名から決定
#         case "$(basename "$DIR")" in
#             "_01") HAZARD_TYPE=1 ;; # 計画規模
#             "_02") HAZARD_TYPE=2 ;; # 想定最大規模
#             "_03") HAZARD_TYPE=3 ;; # 浸水継続時間
#             *) echo "未知のディレクトリ: $DIR"; continue ;;
#         esac

#         echo "ディレクトリ: $DIR (hazard_type=${HAZARD_TYPE})"

#         # GeoJSON ファイルを検索してインポート
#         for FILE in "$DIR"/*.geojson; do
#             if [ -f "$FILE" ]; then
#                 echo "インポート中: $FILE"

#                 # レイヤー名を取得
#                 LAYER_NAME=$(ogrinfo -ro -al -so "$FILE" | grep "Layer name" | awk '{print $3}')

#                 # ogr2ogr でインポート
#                 ogr2ogr \
#                     -f "PostgreSQL" \
#                     PG:"dbname=$DB_NAME user=$DB_USER host=$DB_HOST port=$DB_PORT" \
#                     "$FILE" \
#                     -nln "$TABLE_NAME" \
#                     -append \
#                     -lco GEOMETRY_NAME=geometry \
#                     -lco FID=id \
#                     -lco PRECISION=NO \
#                     -t_srs "EPSG:$SRID" \
#                     -sql "SELECT *, $HAZARD_TYPE AS hazard_type FROM \"$LAYER_NAME\""

#                 if [ $? -eq 0 ]; then
#                     echo "成功: $FILE"
#                 else
#                     echo "エラー: $FILE"
#                 fi
#             fi
#         done
#     fi
# done

# echo "全てのファイルのインポートが完了しました。"