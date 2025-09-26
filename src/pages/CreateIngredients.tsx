 

// Work in progress. Allows user to add more ingredients by pressing +Add ingredients button. Will continue working on this after getting create function for recipe to work. 

// const [ingredients, setIngredients] = useState<Ingredient[]>([
//     { id: 0, name: "", amount: "", recipesId: 0 },
//   ]);

//   const handleIngredientChange = (
//     id: number,
//     field: "name" | "amount",
//     value: string
//   ) => {
//     setIngredients((prev) =>
//       prev.map((ing) => (ing.id === id ? { ...ing, [field]: value } : ing))
//     );
//   };

//   const addIngredientRow = () => {
//     const newId = ingredients.length
//       ? Math.max(...ingredients.map((i) => i.id)) + 1
//       : 1;
//     setIngredients((prev) => [
//       ...prev,
//       { id: newId, name: "", amount: "", recipesId: 0 },
//     ]);
// };
  


//               <Form.Group className="mt-4">
//                 <Form.Label className="fs-5">Ingredients</Form.Label>

//                 {ingredients.map((ing) => (
//                   <Row key={ing.id} className="mb-2">
//                     <Col xs={4}>
//                       <Form.Control
//                         type="text"
//                         placeholder="Amount"
//                         value={ing.amount}
//                         onChange={(e) =>
//                           handleIngredientChange(
//                             ing.id,
//                             "amount",
//                             e.target.value
//                           )
//                         }
//                       />
//                     </Col>
//                     <Col xs={8}>
//                       <Form.Control
//                         type="text"
//                         placeholder="Ingredient"
//                         value={ing.name}
//                         onChange={(e) =>
//                           handleIngredientChange(ing.id, "name", e.target.value)
//                         }
//                       />
//                     </Col>
//                   </Row>
//                 ))}

//                 <Button
//                   variant="primary"
//                   onClick={addIngredientRow}
//                   className="mt-2"
//                 >
//                   + Add Ingredient
//                 </Button>
//               </Form.Group>;