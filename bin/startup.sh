#!/bin/sh
#
# startup      Start up server daemon
#
# author: lupeipei
#

ENV=production
LOG=1

if [ -L $0 ]; then
    SCRIPT=$(ls -l $0|awk '{print $11}')
else
    SCRIPT=$0
fi

APPHOME=$(cd "$(dirname "$SCRIPT")/../"; pwd)
DAEMON=$APPHOME/bin/www
PIDFILE=$APPHOME/bin/running.pid
LOGDIR=$APPHOME/logs/forever

if [ $LOG -eq 1 ] && [ ! -d $LOGDIR ]; then
    mkdir -p $LOGDIR
fi

PARAM="--minUptime 1000 --spinSleepTime 1000"
PIDPARAM="--pidFile $PIDFILE"
LOGPARAM=""
if [ $LOG -eq 1 ]; then
    LOGPARAM="-l $LOGDIR/access.log -o $LOGDIR/out.log -e $LOGDIR/error.log -a"
fi

case "$1" in
    start)
        if [ -f $PIDFILE ]; then
            echo "The server is running."
        else
            NODE_ENV=$ENV forever start $PARAM $LOGPARAM $PIDPARAM $DAEMON
            echo "The server started successfully."
        fi
        ;;
    stop)
        if [ -f $PIDFILE ]; then
            forever stop $PIDPARAM $DAEMON
            echo "The server stopped."
        else
            echo "The server is not running."
        fi
        ;;
    restart)
        if [ -f $PIDFILE ]; then
            NODE_ENV=$ENV forever restart $PARAM $LOGPARAM $PIDPARAM $DAEMON
        else
            NODE_ENV=$ENV forever start $PARAM $LOGPARAM $PIDPARAM $DAEMON
        fi
        echo "The server has been restarted successfully."
        ;;
    status)
        if [ -f $PIDFILE ]; then
            echo "The server is running."
        else
            echo "The server is not running."
        fi
        ;;
    list)
        forever list
        ;;
    *)
        echo "Usage: $SCRIPT {start|stop|restart|status|list}"
        exit 1
        ;;
esac
exit 0
