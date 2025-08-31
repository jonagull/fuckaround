"use client";
import React from "react";
import { Address } from "weddingplanner-shared";
import { useAddressSearch } from "weddingplanner-shared";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Input } from "./ui/input";

interface AddressSearchProps {
  onChange?: (address: Address | null) => void;
  value?: Address | null;
  placeholder?: string;
  className?: string;
}

export function AddressSearch({
  onChange,
  value,
  placeholder = "Search for venue address...",
  className = ""
}: AddressSearchProps) {
  const { searchQuery, search, clear, addresses, isLoading } = useAddressSearch();
  const [showDropdown, setShowDropdown] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(value || null);

  useEffect(() => {
    if (value) {
      setSelectedAddress(value);
      setLocalQuery(`${value.street}, ${value.city}`);
    }
  }, [value]);

  const handleInputChange = (query: string) => {
    setLocalQuery(query);
    search(query);
    setShowDropdown(query.length >= 2);

    if (!query) {
      setSelectedAddress(null);
      onChange?.(null);
      clear();
    }
  };

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address);
    setLocalQuery(`${address.street}, ${address.city}`);
    setShowDropdown(false);
    onChange?.(address);
    clear();
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 200);
  };

  const handleFocus = () => {
    if (searchQuery.length >= 2 && addresses.length > 0 && !selectedAddress) {
      setShowDropdown(true);
    }
  };

  return (
    <div className={`${className} relative`}>
      <Input
        type="text"
        value={localQuery}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        className="w-full"
      />

      {showDropdown && (
        <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center py-3">
              <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
            </div>
          ) : addresses.length > 0 ? (
            <div className="py-1">
              {addresses.map((address) => (
                <button
                  key={address.placeId}
                  type="button"
                  onClick={() => handleAddressSelect(address)}
                  className="w-full text-left px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                >
                  <div className="text-sm font-medium">{address.street}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {address.city}{address.state ? `, ${address.state}` : ''} {address.zip}
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
              No addresses found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
