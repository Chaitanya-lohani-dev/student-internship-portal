echo "Waiting for MongoDB to start..."
until nc -z mongo 27017; do
    sleep 2
done 

echo "Running database seeding script..."
node config/init-db.js

echo "Starting the application..."
node server.js