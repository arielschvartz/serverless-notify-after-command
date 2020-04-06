initialAmount=$(ps aux | egrep "sls $1|serverless $1" -c);
amount=$initialAmount;

while [ $initialAmount = $amount ]
do
  sleep 0.1;
  amount=$(ps aux | egrep "sls $1|serverless $1" -c);
done;
notify-send "Serverless" "Command finished." --icon=dialog-information

if $2;
then
  paplay $3;
fi;