import { useState, useRef } from "react";
import QuotationTable from "./QuotationTable";
import { 
  Box, 
  Input, 
  InputLabel, 
  InputAdornment, 
  FormControl, 
  TextField,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  Divider
} from '@mui/material';
import {
  LocalOffer,
  Add
} from '@mui/icons-material';
import { useEffect } from "react";
import { useForm } from "react-hook-form";

const products = [
  { code: "p001", name: "Product A", price: 100 },
  { code: "p002", name: "Product B", price: 200 },
  { code: "p003", name: "Product C", price: 150 },
  { code: "p004", name: "Product D", price: 250 },
];

function App() {
  const storage = JSON.parse(localStorage.getItem('dataItems')) || [];
  const [dataItems, setDataItems] = useState(storage);
  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  useEffect(() => {
    localStorage.setItem('dataItems', JSON.stringify(dataItems));
  }, [dataItems]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    getValues
  } = useForm({
    defaultValues: {
      code: products[0].code,
      qty: 1,
      discount: 0
    }
  });

  const addItem = (formData) => {
    const { code, qty, discount } = formData;
    const item = products.find((v) => v.code === code);

    const newItem = {
      ...item,
      qty: Number(qty),
      discount: Number(discount),
      ppu: item.price
    };

    const existingItemIndex = dataItems.findIndex(
      (i) => i.code === newItem.code && i.ppu === newItem.ppu
    );

    if (existingItemIndex >= 0) {
      const updatedItems = [...dataItems];
      const existingItem = updatedItems[existingItemIndex];
      const totalQty = existingItem.qty + newItem.qty;
      const totalDiscountValue = existingItem.discount + newItem.discount;

      existingItem.qty = totalQty;
      existingItem.discount = totalDiscountValue;

      setDataItems(updatedItems);
    } else {
      setDataItems([...dataItems, newItem]);
    }

    // Instead of resetting, maintain the current values
    setValue('qty', getValues('qty'));
    setValue('discount', getValues('discount'));
  };

  const deleteByIndex = (index) => {
    let newDataItems = [...dataItems];
    newDataItems.splice(index, 1);
    setDataItems(newDataItems);
  }

  const handleProductChange = (event) => {
    const productCode = event.target.value;
    const selected = products.find(p => p.code === productCode);
    setSelectedProduct(selected);
    setValue('code', productCode);
  }

  const handleClear = () => {
    setDataItems([]);
  }

  return (
    <form onSubmit={handleSubmit(addItem)}>
      <Box sx={{ flexGrow: 1, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={3} sx={{ p: 2, backgroundColor: '#f5f5f5' }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="product-select-label">Item</InputLabel>
                    <Select
                      labelId="product-select-label"
                      id="product-select"
                      label="Item"
                      {...register("code")}
                      onChange={handleProductChange}
                      defaultValue={products[0].code}
                    >
                      {products.map((p) => (
                        <MenuItem key={p.code} value={p.code}>
                          {p.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Price Per Unit"
                    type="number"
                    value={selectedProduct.price}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Quantity"
                    type="number"
                    {...register("qty", { 
                      required: "Quantity is required",
                      min: { value: 1, message: "Minimum quantity is 1" }
                    })}
                    error={!!errors.qty}
                    helperText={errors.qty?.message}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="discount-input">Discount</InputLabel>
                    <Input
                      id="discount-input"
                      type="number"
                      {...register("discount", { 
                        min: { value: 0, message: "Discount cannot be negative" }
                      })}
                      startAdornment={
                        <InputAdornment position="start">
                          <LocalOffer />
                        </InputAdornment>
                      }
                    />
                  </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Button 
                    variant="contained" 
                    type="submit" 
                    fullWidth
                    startIcon={<Add />}
                  >
                    Add Item
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={8}>
            <QuotationTable
              data={dataItems}
              deleteByIndex={deleteByIndex}
              onClear={handleClear} 
            />
          </Grid>
        </Grid>
      </Box>
    </form>
  );
}

export default App;