function user(uuid){
  return {
    uuid,
		alarms: 
		[ 
			{
				alarm_type: "1",
				active: "1",
				dosage: "0",
				time: "16",
				luminous: "1",
				medicine_type: "1",
				minute: "18",
				medical_name: "Neosaldina",
				notification_id: "945",
				period_hour: "0",
				period_min: "0",
				posBox: "3",
				quantity: "1",
				quantity_box: "10",
				monday: "0",
				third: "0",
				wednesday: "0",
				thursday: "0",
				friday: "0",
				saturday: "0",
				sunday: "1",
				sound: "1",
				times_day: "0",
			},
      {
				alarm_type: "1",
				active: "1",
				dosage: "0",
				time: "16",
				luminous: "1",
				medicine_type: "1",
				minute: "10",
				medical_name: "Dipirona",
				notification_id: "25",
				period_hour: "0",
				period_min: "0",
				posBox: "3",
				quantity: "1",
				quantity_box: "10",
				monday: "0",
				third: "0",
				wednesday: "0",
				thursday: "0",
				friday: "0",
				saturday: "0",
				sunday: "1",
				sound: "1",
				times_day: "0",
			}
		],
		box: 
		[
			{
				idBox: "FFAB6224",
				nameBox: "quarto",
			}
		],
		login: 
		{
			cell: "",
			email: "teste",
			senha: "teste",
		}
	};
}

module.exports = {
  user,
};
