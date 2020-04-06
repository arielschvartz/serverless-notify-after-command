initialAmount=$(ps aux | egrep "sls $1|serverless $1" -c);
amount=$initialAmount;

while [ $initialAmount = $amount ]
do
  sleep 0.1;
  amount=$(ps aux | egrep "sls $1|serverless $1" -c);
done;
notify-send -t 10 -a "serverless-notify-after-command" "Serverless" "Command finished."

if $2;
then
  paplay 'notification.mp3';
fi;