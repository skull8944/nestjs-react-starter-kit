echo "Starting service..."
echo "NODE_ENV: $NODE_ENV"
echo "SERVER_TYPE: $SERVER_TYPE"

if [ "$SERVER_TYPE" = "job" ]; then
  npm run start:prod
else
  npm run prisma:deploy && npm run seed && npm run start:prod
fi