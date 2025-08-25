import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  StyleSheet,
  Pressable,
} from "react-native";

export interface DropdownItem {
  label: string;
  value: string | number;
  disabled?: boolean;
}

interface DropdownProps {
  data: DropdownItem[];
  placeholder?: string;
  value?: string | number;
  onSelect: (item: DropdownItem) => void;
  disabled?: boolean;
  searchable?: boolean;
  renderItem?: (item: DropdownItem, index: number) => React.ReactNode;
}

export const Dropdown: React.FC<DropdownProps> = ({
  data,
  placeholder = "Select an option",
  value,
  onSelect,
  disabled = false,
  searchable = false,
  renderItem,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const selectedItem = data.find((item) => item.value === value);

  const filteredData = searchable
    ? data.filter((item) =>
        item.label.toLowerCase().includes(searchText.toLowerCase())
      )
    : data;

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;
    onSelect(item);
    setIsOpen(false);
    setSearchText("");
  };

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.dropdownButton,
          disabled && { backgroundColor: "#f3f4f6" },
        ]}
        onPress={() => !disabled && setIsOpen(true)}
        disabled={disabled}
      >
        <Text style={{ color: selectedItem ? "#000" : "#9ca3af" }}>
          {selectedItem ? selectedItem.label : placeholder}
        </Text>
        <Text style={{ color: "#9ca3af" }}>{isOpen ? "▲" : "▼"}</Text>
      </TouchableOpacity>

      <Modal visible={isOpen} transparent animationType="fade">
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={() => setIsOpen(false)} />

        <View style={styles.dropdownContainer}>
          {searchable && (
            <TextInput
              style={styles.searchInput}
              placeholder="Search..."
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          )}

          <FlatList
            data={filteredData}
            keyExtractor={(item, index) => `${item.value}-${index}`}
            renderItem={({ item, index }) =>
              renderItem ? (
                <TouchableOpacity
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                >
                  {renderItem(item, index)}
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.dropdownItem,
                    item.disabled && styles.disabledItem,
                    item.value === value && styles.selectedItem,
                  ]}
                  onPress={() => handleSelect(item)}
                  disabled={item.disabled}
                >
                  <Text
                    style={[
                      item.disabled && { color: "#9ca3af" },
                      item.value === value && { color: "#2563eb" },
                    ]}
                  >
                    {item.label}
                  </Text>
                </TouchableOpacity>
              )
            }
            ListEmptyComponent={
              <Text style={styles.noOptions}>No options found</Text>
            }
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  dropdownContainer: {
    position: "absolute",
    top: "30%",
    left: "5%",
    right: "5%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#d1d5db",
    maxHeight: "50%",
  },
  searchInput: {
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    padding: 8,
  },
  dropdownItem: {
    padding: 12,
  },
  disabledItem: {
    backgroundColor: "#f9fafb",
  },
  selectedItem: {
    backgroundColor: "#dbeafe",
  },
  noOptions: {
    padding: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
