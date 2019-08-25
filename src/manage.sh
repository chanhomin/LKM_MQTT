case $1 in
	editUserPermission)
		if [ $# -lt 2 ]; then
			ts-node src/manage.ts help
			exit
		fi

		tmpFile=$(mktemp)
		ts-node src/manage.ts showUserPermission $2 > $tmpFile
		nano $tmpFile
		ts-node src/manage.ts editUserPermission $2 $tmpFile
		rm $tmpFile
	;;

	editGroupPermission)
		if [ $# -lt 2 ]; then
			ts-node src/manage.ts help
			exit
		fi
		tmpFile=$(mktemp)
		ts-node src/manage.ts showGroupPermission $2 > $tmpFile
		nano $tmpFile
		ts-node src/manage.ts editGroupPermission $2 $tmpFile
		rm $tmpFile
	;;

	*)
		ts-node src/manage.ts $@
	;;
esac
