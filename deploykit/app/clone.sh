
user=$(sed -n 1p ${1})
token=$(sed -n 2p ${1})
git clone https://$user:$token@github.com/Lit-to/LitTimeline.git/


