import {
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableFooter,
  Typography
} from "@mui/material";
import { CiShoppingCart } from "react-icons/ci";
import { MdClear } from "react-icons/md";
import { BsFillTrashFill } from "react-icons/bs";

function QuotationTable({ data, deleteByIndex, onClear }) {
  // Guard condition
  if (!data || data.length === 0) {
    return (
      <Container>
        <Typography variant="h4" component="h1" gutterBottom>
          Quotation
        </Typography>
        <Typography paragraph>
          <CiShoppingCart /> No items
        </Typography>
      </Container>
    );
  }

  const discountTotal = data.reduce((acc, v) => acc + v.discount, 0);
  const total = data.reduce((acc, v) => acc + v.qty * v.ppu, 0);

  const handleDelete = (index) => {
    deleteByIndex(index);
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Quotation
      </Typography>
      <Button
        variant="outlined"
        color="inherit"
        onClick={onClear}
        startIcon={<MdClear />}
        sx={{ mb: 2 }}
      >
        Clear
      </Button>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="center">-</TableCell>
            <TableCell align="center">Qty</TableCell>
            <TableCell align="center">Item</TableCell>
            <TableCell align="center">Price/Unit</TableCell>
            <TableCell align="right">Discount</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((v, i) => {
            let amount = v.qty * v.ppu;
            return (
              <TableRow key={i}>
                <TableCell align="center">
                  <BsFillTrashFill
                    onClick={() => handleDelete(i)}
                    style={{ cursor: "pointer" }}
                  />
                </TableCell>
                <TableCell align="center">{v.qty}</TableCell>
                <TableCell>{v.item}</TableCell>
                <TableCell align="center">{v.ppu}</TableCell>
                <TableCell align="right">{v.discount}</TableCell>
                <TableCell align="right">{amount - v.discount}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={4} align="right">
              Total
            </TableCell>
            <TableCell align="right">{discountTotal}</TableCell>
            <TableCell align="right">{total - discountTotal}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </Container>
  );
}

export default QuotationTable;