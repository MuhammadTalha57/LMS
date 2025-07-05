"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SearchIcon } from "lucide-react";

let category: string;

export default function Search({
  categories,
  handleSearch,
}: {
  categories: string[];
  handleSearch: (searchData: Record<string, string>) => void;
}) {
  const [checkedCategories, setCheckedCategories] = useState<Set<string>>(
    new Set()
  );
  const [searchValues, setSearchValues] = useState<Record<string, string>>({});
  const [isSearchDisabled, setIsSearchDisabled] = useState(true);

  // Handle checkbox change
  const handleCategoryCheck = (category: string, checked: boolean) => {
    const newCheckedCategories = new Set(checkedCategories);

    if (checked) {
      newCheckedCategories.add(category);
      setSearchValues((prev) => ({ ...prev, [category]: "" }));
    } else {
      newCheckedCategories.delete(category);
      setSearchValues((prev) => {
        const newValues = { ...prev };
        delete newValues[category];
        return newValues;
      });
    }

    setCheckedCategories(newCheckedCategories);
  };

  // Handle search input change
  const handleSearchValueChange = (category: string, value: string) => {
    setSearchValues((prev) => ({ ...prev, [category]: value }));
  };

  // Update search button disabled state
  useEffect(() => {
    const hasCheckedCategories = checkedCategories.size > 0;
    const hasValidSearchValues = Array.from(checkedCategories).every(
      (category) => searchValues[category]?.trim().length > 0
    );

    setIsSearchDisabled(!hasCheckedCategories || !hasValidSearchValues);
  }, [checkedCategories, searchValues]);

  // Handle search button click
  const handleSearchClick = () => {
    const searchData: Record<string, string> = {};
    Array.from(checkedCategories).forEach((category) => {
      if (searchValues[category]?.trim()) {
        searchData[category] = searchValues[category].trim();
      }
    });
    handleSearch(searchData);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Categories Checkboxes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Categories
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={checkedCategories.has(category.toLowerCase())}
                onCheckedChange={(checked) =>
                  handleCategoryCheck(
                    category.toLowerCase(),
                    checked as boolean
                  )
                }
              />
              <Label
                htmlFor={`category-${category}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
              >
                {category}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Search Fields for Checked Categories */}
      {checkedCategories.size > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Search Terms</h3>
          <div className="space-y-3">
            {Array.from(checkedCategories).map((category) => (
              <div key={`search-${category}`} className="space-y-2">
                <Label
                  htmlFor={`search-input-${category}`}
                  className="text-sm font-medium capitalize"
                >
                  {category}
                </Label>
                <Input
                  id={`search-input-${category}`}
                  type="text"
                  placeholder={`Enter search term for ${category}...`}
                  value={searchValues[category.toLowerCase()] || ""}
                  onChange={(e) =>
                    handleSearchValueChange(
                      category.toLowerCase(),
                      e.target.value
                    )
                  }
                  className="w-full"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Button */}
      <div className="flex justify-center pt-4">
        <Button
          onClick={handleSearchClick}
          disabled={isSearchDisabled}
          className="px-8 py-2 flex items-center space-x-2"
          size="lg"
        >
          <SearchIcon className="w-4 h-4" />
          <span>Search</span>
        </Button>
      </div>

      {/* Helper Text */}
      {checkedCategories.size === 0 && (
        <p className="text-sm text-gray-500 text-center">
          Select at least one category to start searching
        </p>
      )}

      {checkedCategories.size > 0 && isSearchDisabled && (
        <p className="text-sm text-gray-500 text-center">
          Fill in all search fields to enable search
        </p>
      )}
    </div>
  );
}
