numberOfchanges=$(git diff origin/main -- app.json | egrep '\+.+("version"|"versionCode")' | wc -l)

if (($numberOfchanges != "2")); then
    echo '"version" and "versionCode" not changed in app.json'
    exit 1
fi

echo "App.json OK"
