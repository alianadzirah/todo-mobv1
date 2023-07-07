import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";

interface IToDo {
  text: string;
  completed: boolean;
}

export default function App() {
  const [value, setValue] = useState<string>("");
  const [toDoList, setToDos] = useState<IToDo[]>([]);
  const [error, showError] = useState<Boolean>(false);
  const [edit, showEdit] = useState<Boolean>(false);
  const [editTask, setEditTask] = useState<string>("");
  const [taskIDEdit, setTaskIDEdit] = useState(0);
  const [oriEditText, setOriEditText] = useState<string>("");
  const [anyUndo, setAnyUndo] = useState<Boolean>(false);
  const [tasksUndo, setTasksUndo] = useState<IToDo[]>([]);

  const editTaskHandler = () => {
    console.log("Edit text ID: " + taskIDEdit);
    showEdit(false);
    setAnyUndo(true);

    if (editTask !== "") {
      const newTask = toDoList.map((task, id) => {
        // id same then update the data with new data (complete) !task.complete to be safe since only true or false
        if (id === taskIDEdit) {
          //setTaskEditData(taskUpdateData);
          return { ...task, text: editTask };
        }

        // if not the same then just send the before change
        return task;
      });
      setToDos(newTask);
      setEditTask("");
      console.log("edited");
    } else {
      showError(true);
      console.log("not edit");
    }
  };

  const handleSubmit = (): void => {
    if (value.trim()) {
      //setAnyUndo(true);
      setToDos([...toDoList, { text: value, completed: false }]);
    } else showError(true);
    setValue("");

    console.log("id:", toDoList);
  };

  const removeItem = (index: number): void => {
    console.log(index);
    setTasksUndo(toDoList);
    setAnyUndo(true);
    const newToDoList = [...toDoList];
    newToDoList.splice(index, 1);
    setToDos(newToDoList);
  };

  const toggleComplete = (index: number): void => {
    setAnyUndo(true);
    setTasksUndo(toDoList);
    const newToDoList = [...toDoList];
    newToDoList[index].completed = !newToDoList[index].completed;
    console.log(newToDoList[index].completed)
    setToDos(newToDoList);
  };

  const undoHandler = () => {
    setToDos(tasksUndo);
    setAnyUndo(false);
  };

  return (
    <View>
      <ScrollView>
        <View style={styles.titlecontainer}>
          <Text style={styles.title}>Hello, what's your task today?</Text>
          <View style={styles.rowItem}>
            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Put your task here..."
                value={value}
                onChangeText={(e) => {
                  setValue(e);
                  showError(false);
                }}
                style={styles.inputBox}
              />

              <Pressable style={styles.buttonAdd} onPress={handleSubmit}>
                <Ionicons name="add" size={40} color="white" />
              </Pressable>
            </View>
            {edit && (
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder={oriEditText}
                  value={editTask}
                  onChangeText={(e) => {
                    setEditTask(e);
                    showError(false);
                  }}
                  style={styles.inputBox}
                />
                <Pressable style={styles.buttonAdd} onPress={editTaskHandler}>
                  <Ionicons
                    name="checkmark-done-outline"
                    size={30}
                    color="white"
                  />
                </Pressable>
              </View>
            )}
            {anyUndo && (
              <View style={styles.inputWrapper}>
                <Pressable style={styles.buttonAdd} onPress={undoHandler}>
                  <Ionicons name="arrow-undo" size={30} color="white" />
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View style={styles.container}>
          {error && <Text style={styles.error}>Empty task!</Text>}
          {toDoList.length === 0 && (
            <Text style={styles.informStyle}>
              You don't have any task to do now
            </Text>
          )}
          {toDoList.map((toDo: IToDo, index: number) => (
            <View style={styles.listItem} key={`${index}_${toDo.text}`}>
              <Pressable
                onPress={() => {
                  toggleComplete(index);
                }}
              >
                <Ionicons
                  name="checkmark-circle"
                  margin={5}
                  size={25}
                  color="#fefae0"
                />
              </Pressable>
              <Text
                style={[
                  styles.task,
                  {
                    textDecorationLine: toDo.completed
                      ? "line-through"
                      : "none",
                  },
                ]}
              >
                {toDo.text}
              </Text>
              <Pressable
                onPress={() => {
                  setTaskIDEdit(index);
                  setOriEditText(toDo.text);
                  showEdit(true);
                }}
              >
                <Ionicons name="create" margin={5} size={25} color="#fefae0" />
              </Pressable>
              <Pressable
                onPress={() => {
                  removeItem(index);
                }}
              >
                <Ionicons
                  name="trash-bin"
                  margin={5}
                  size={25}
                  color="#fefae0"
                />
              </Pressable>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 35,
    alignItems: "center",
  },
  informStyle: {
    fontSize: 18,
  },
  buttonAdd: {
    width: 50,
    height: 50,
    backgroundColor: "#283618",
    borderRadius: 50,
    marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  rowItem: {
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  inputWrapper: {
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  inputBox: {
    width: 250,
    fontSize: 18,
    backgroundColor: "white",
    borderColor: "#606c38",
    borderRadius: 8,
    borderWidth: 2,
    padding: 10,
  },
  titlecontainer: {
    alignItems: "center",
    backgroundColor: "#606c38",
    width: "100%",
    paddingTop: 70,
    paddingBottom: 30,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 20,
    color: "purple",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#dda15e",
    padding: 20,
    borderRadius: 20,
  },
  addButton: {
    alignItems: "flex-end",
  },
  task: {
    fontSize: 20,
    width: 180,
    marginLeft: 5,
  },
  error: {
    fontSize: 20,
    marginBottom: 20,
    color: "red",
  },
});
