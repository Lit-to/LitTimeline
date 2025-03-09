user=$(sed -n 1p ${1})
token=$(sed -n 2p ${1})
user=`echo $user | sed 's/\r//g'`
token=`echo $token | sed 's/\r//g'`
echo $user
echo $token
url="https://${user}:${token}@github.com/Lit-to/LitTimeline.git"
echo $url
git clone $url
