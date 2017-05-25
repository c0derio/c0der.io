import React, { Component } from 'react';
import formatCurrency from 'format-currency';

import {
  Table,
  TableCell,
  TableRouteCell,
  TableBody,
  TableTextCell,
  TableHeader,
  TableColumn,
  TableRow
} from '../Dashboard';

export default class ProjectsTable extends Component {
  static propTypes = {
    projects: React.PropTypes.array.isRequired,
    loading: React.PropTypes.bool.isRequired
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.projects !== this.props.projects;
  }

  render() {
    let projects = this.props.projects || [];

    return (
      <Table>
        <TableHeader>
          <TableColumn width="10%">Name</TableColumn>
        </TableHeader>
        <TableBody>
          { projects.map((project, index) => {
            return <TableRow key={index}>
              <TableRouteCell
                route={`/projects/${project.name}`}>{project.name}</TableRouteCell>
            </TableRow>;
          })}
        </TableBody>
      </Table>
    );
  }
}
