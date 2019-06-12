OLDPID=$(netstat -lp | grep :5000 | column -t | colrm 1  39 | cut -d "/" -f 1)
echo "Running process PID is:"
echo $OLDPID
kill $OLDPID
npm run dev