import React from "react";
import { Grid, Avatar } from "@material-ui/core";
import MaterialTable from "material-table";
import { searchUsers } from "../../../services/adminService";
import { useStyles } from "./styles";
import TimeAgo from "../../../components/ui/TimeAgo";

const Administrator = () => {
  const classes = useStyles();

  const handleUpdateData = async query => {
    console.log(query);
    const { pageSize, page, search } = query;
    try {
      const res = await searchUsers(pageSize, page, search);
      return res;
    } catch (error) {
      console.log(error.message);
    }
  };

  const options = {
    style: { borderRadius: 0 },
    localization: { header: { actions: "" } },
    options: {
      pageSize: 20,
      pageSizeOptions: [],
      showTitle: false,
      actionsColumnIndex: 6
    }
  };

  return (
    <Grid item lg={6} className={classes.tableWrapper}>
      <MaterialTable
        {...options}
        columns={[
          {
            field: "image",
            width: 1,
            cellStyle: { whiteSpace: "nowrap" },
            render: rowData => (
              <Avatar
                alt={rowData.name}
                src={rowData.image}
                className={classes.image}
              />
            )
          },
          { title: "Name", field: "name" },
          { title: "Surname", field: "surname" },
          { title: "City", field: "city" },
          { title: "Country", field: "country" },
          {
            title: "Date",
            field: "date",
            render: rowData => <TimeAgo date={new Date(rowData.date)} />
          }
        ]}
        data={query =>
          new Promise((resolve, reject) => {
            handleUpdateData(query).then(res =>
              resolve({
                data: res.cases,
                page: res.page,
                totalCount: res.count
              })
            );
          })
        }
        editable={{
          onRowDelete: oldData =>
            new Promise(resolve => {
              resolve();
            })
        }}
      />
    </Grid>
  );
};

export default Administrator;
